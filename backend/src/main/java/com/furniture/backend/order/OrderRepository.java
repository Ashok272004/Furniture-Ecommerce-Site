package com.furniture.backend.order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUser_EmailOrderByCreatedAtDesc(String email);
    Optional<Order> findByIdAndUser_Email(Long id, String email);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Order> findByRazorpayPaymentId(String razorpayPaymentId);
}
