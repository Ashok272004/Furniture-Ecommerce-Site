package com.furniture.backend.payment;

import com.furniture.backend.order.OrderRequest;

public class RazorpayVerificationRequest {

    private OrderRequest order;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    public RazorpayVerificationRequest() {
    }

    public OrderRequest getOrder() {
        return order;
    }

    public void setOrder(OrderRequest order) {
        this.order = order;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}