package com.furniture.backend.order;

import com.furniture.backend.product.Product;
import com.furniture.backend.product.ProductRepository;
import com.furniture.backend.user.User;
import com.furniture.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getMyOrders(String email) {
        return orderRepository.findAllByUser_EmailOrderByCreatedAtDesc(email);
    }

    public List<OrderItemResponse> getMyOrderItems(Long orderId, String email) {
        orderRepository.findByIdAndUser_Email(orderId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found"
                ));

        return getOrderItems(orderId);
    }

    public List<OrderItemResponse> getOrderItems(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Order not found"
            );
        }

        return orderItemRepository.findAllByOrder_Id(orderId)
                .stream()
                .map(OrderItemResponse::from)
                .toList();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order status is required"
            );
        }

        String normalizedStatus = status.trim().toUpperCase(Locale.ROOT);

        Set<String> allowedStatuses = Set.of(
                "PLACED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
        );

        if (!allowedStatuses.contains(normalizedStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid order status"
            );
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found"
                ));

        String currentStatus = order.getStatus() == null
                ? ""
                : order.getStatus().trim().toUpperCase(Locale.ROOT);

        if ("CANCELLED".equals(currentStatus)
                && !"CANCELLED".equals(normalizedStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A cancelled order cannot be reopened"
            );
        }

        if ("CANCELLED".equals(normalizedStatus)
                && !"CANCELLED".equals(currentStatus)) {
            if (!"PLACED".equals(currentStatus)
                    && !"CONFIRMED".equals(currentStatus)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Only placed or confirmed orders can be cancelled"
                );
            }

            restoreOrderStock(orderId);
        }

        order.setStatus(normalizedStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelMyOrder(Long orderId, String email) {
        Order order = orderRepository.findByIdAndUser_Email(orderId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found"
                ));

        String currentStatus = order.getStatus() == null
                ? ""
                : order.getStatus().trim().toUpperCase(Locale.ROOT);

        if (!"PLACED".equals(currentStatus)
                && !"CONFIRMED".equals(currentStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This order can no longer be cancelled"
            );
        }

        restoreOrderStock(orderId);

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    @Transactional
    public Order createOrder(OrderRequest request, String userEmail) {
        if (request == null
                || request.getItems() == null
                || request.getItems().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order must contain at least one product"
            );
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
        
        String paymentMethod = request.getPaymentMethod();

        if (paymentMethod == null || paymentMethod.isBlank()) {
            paymentMethod = "COD";
        }

        paymentMethod = paymentMethod.trim().toUpperCase(Locale.ROOT);

        if (!"COD".equals(paymentMethod)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Online payment is not configured yet"
            );
        }

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(request.getCustomerName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());

        List<OrderItem> orderItems = request.getItems()
                .stream()
                .map(item -> {
                    if (item.getQuantity() <= 0) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Quantity must be greater than zero"
                        );
                    }

                    Product product = productRepository
                            .findById(item.getProductId())
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

                    BigDecimal unitPrice =
                            BigDecimal.valueOf(product.getPrice());

                    product.setStock(
                            product.getStock() - item.getQuantity()
                    );
                    productRepository.save(product);

                    return new OrderItem(
                            order,
                            product,
                            item.getQuantity(),
                            unitPrice
                    );
                })
                .toList();

        BigDecimal total = orderItems.stream()
                .map(item -> item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotal(total);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        return savedOrder;
    }

    private void restoreOrderStock(Long orderId) {
        List<OrderItem> items = orderItemRepository.findAllByOrder_Id(orderId);

        for (OrderItem item : items) {
            Product product = item.getProduct();

            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
    }
}