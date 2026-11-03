package com.furniture.backend.payment;

import com.furniture.backend.order.Order;
import com.furniture.backend.order.OrderRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/razorpay")
// @CrossOrigin(
//         origins = "http://localhost:5173",
//         allowCredentials = "true"
// )
public class RazorpayPaymentController {

    private final RazorpayPaymentService razorpayPaymentService;

    public RazorpayPaymentController(
            RazorpayPaymentService razorpayPaymentService
    ) {
        this.razorpayPaymentService = razorpayPaymentService;
    }

    @PostMapping("/orders")
    public RazorpayOrderResponse createRazorpayOrder(
            @Valid @RequestBody OrderRequest request
    ) {
        return razorpayPaymentService.createRazorpayOrder(request);
    }

    @PostMapping("/verify")
    public Order verifyPayment(
            @Valid @RequestBody RazorpayVerificationRequest request,
            Authentication authentication
    ) {
        return razorpayPaymentService.verifyAndPlaceOrder(
                request,
                authentication.getName()
        );
    }
}