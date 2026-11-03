package com.furniture.backend.order;

import java.math.BigDecimal;

public class OrderItemResponse {

    private final Long id;
    private final Long productId;
    private final String productName;
    private final String category;
    private final String description;
    private final String imageUrl;
    private final int quantity;
    private final BigDecimal unitPrice;

    public OrderItemResponse(
            Long id,
            Long productId,
            String productName,
            String category,
            String description,
            String imageUrl,
            int quantity,
            BigDecimal unitPrice
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.description = description;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getCategory(),
                item.getProduct().getDescription(),
                item.getProduct().getImageUrl(),
                item.getQuantity(),
                item.getUnitPrice()
        );
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
}
