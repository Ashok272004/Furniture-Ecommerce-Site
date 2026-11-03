package com.furniture.backend.payment;

import com.furniture.backend.order.Order;
import com.furniture.backend.order.OrderRepository;
import com.furniture.backend.order.OrderRequest;
import com.furniture.backend.order.OrderService;
import com.furniture.backend.product.Product;
import com.furniture.backend.product.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
public class RazorpayPaymentService {

    private final RestClient razorpayRestClient;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final String razorpayKeySecret;

    public RazorpayPaymentService(
            RestClient razorpayRestClient,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderService orderService,
            @Value("${razorpay.key-secret}") String razorpayKeySecret
    ) {
        this.razorpayRestClient = razorpayRestClient;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.razorpayKeySecret = razorpayKeySecret;
    }

    public RazorpayOrderResponse createRazorpayOrder(OrderRequest request) {
        long amountInPaise = calculateAmountInPaise(request);

        Map<String, Object> requestBody = Map.of(
                "amount", amountInPaise,
                "currency", "INR",
                "receipt", "furniture_" + UUID.randomUUID()
        );

        try {
            RazorpayOrderResponse response = razorpayRestClient.post()
                    .uri("/orders")
                    .body(requestBody)
                    .retrieve()
                    .body(RazorpayOrderResponse.class);

            if (response == null || response.getId() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Razorpay did not return an order ID"
                );
            }

            return response;
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Could not create a Razorpay order"
            );
        }
    }

    @Transactional
    public Order verifyAndPlaceOrder(
            RazorpayVerificationRequest request,
            String userEmail
    ) {
        if (request == null || request.getOrder() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order details are required"
            );
        }

        verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (orderRepository.findByRazorpayOrderId(
                request.getRazorpayOrderId()
        ).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This payment has already been processed"
            );
        }

        RazorpayOrderResponse gatewayOrder;

        try {
            gatewayOrder = razorpayRestClient.get()
                    .uri("/orders/{id}", request.getRazorpayOrderId())
                    .retrieve()
                    .body(RazorpayOrderResponse.class);
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Could not verify the Razorpay order"
            );
        }

        long expectedAmount = calculateAmountInPaise(request.getOrder());

        if (gatewayOrder == null
                || !request.getRazorpayOrderId().equals(gatewayOrder.getId())
                || !"INR".equals(gatewayOrder.getCurrency())
                || gatewayOrder.getAmount() != expectedAmount) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment amount does not match the order"
            );
        }

        // Existing OrderService creates COD orders, so use COD temporarily.
        request.getOrder().setPaymentMethod("COD");

        Order savedOrder = orderService.createOrder(
                request.getOrder(),
                userEmail
        );

        savedOrder.setPaymentMethod("RAZORPAY");
        savedOrder.setPaymentStatus("PAID");
        savedOrder.setRazorpayOrderId(request.getRazorpayOrderId());
        savedOrder.setRazorpayPaymentId(request.getRazorpayPaymentId());

        return orderRepository.save(savedOrder);
    }

    private long calculateAmountInPaise(OrderRequest request) {
        if (request == null
                || request.getItems() == null
                || request.getItems().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order must contain at least one product"
            );
        }

        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.Item item : request.getItems()) {
            if (item.getQuantity() <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Quantity must be greater than zero"
                );
            }

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Product not found: " + item.getProductId()
                    ));

            if (product.getStock() < item.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        product.getName() + " has insufficient stock."
                );
            }

            BigDecimal lineTotal = BigDecimal.valueOf(product.getPrice())
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            total = total.add(lineTotal);
        }

        return total
                .setScale(2, RoundingMode.HALF_UP)
                .movePointRight(2)
                .longValueExact();
    }

    private void verifyPaymentSignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {
        if (razorpayOrderId == null || razorpayOrderId.isBlank()
                || razorpayPaymentId == null || razorpayPaymentId.isBlank()
                || razorpaySignature == null || razorpaySignature.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment verification details are required"
            );
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );

            mac.init(secretKey);

            byte[] expectedSignature = mac.doFinal(
                    (razorpayOrderId + "|" + razorpayPaymentId)
                            .getBytes(StandardCharsets.UTF_8)
            );

            byte[] receivedSignature =
                    HexFormat.of().parseHex(razorpaySignature);

            if (!MessageDigest.isEqual(
                    expectedSignature,
                    receivedSignature
            )) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Payment signature is invalid"
                );
            }
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment signature format is invalid"
            );
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException(
                    "Could not verify Razorpay payment signature",
                    exception
            );
        }
    }
}