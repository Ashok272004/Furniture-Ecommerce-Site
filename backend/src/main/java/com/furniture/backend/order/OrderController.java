package com.furniture.backend.order;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}/items")
    public List<OrderItemResponse> getOrderItems(@PathVariable Long id) {
        return orderService.getOrderItems(id);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        Order savedOrder = orderService.createOrder(
                request,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(Authentication authentication) {
        return orderService.getMyOrders(authentication.getName());
    }

    @PostMapping("/my/{id}/cancel")
    public Order cancelMyOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return orderService.cancelMyOrder(id, authentication.getName());
    }
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateOrderStatus(id, request.getStatus());
    }

    @GetMapping("/my/{id}/items")
    public List<OrderItemResponse> getMyOrderItems(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return orderService.getMyOrderItems(id, authentication.getName());
    }
    
}