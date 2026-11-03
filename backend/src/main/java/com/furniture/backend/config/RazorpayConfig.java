package com.furniture.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RazorpayConfig {

    @Bean
    public RestClient razorpayRestClient(
            @Value("${razorpay.key-id}") String keyId,
            @Value("${razorpay.key-secret}") String keySecret
    ) {
        if (keyId.isBlank() || keySecret.isBlank()) {
            throw new IllegalStateException(
                    "Razorpay test keys are missing"
            );
        }

        return RestClient.builder()
                .baseUrl("https://api.razorpay.com/v1")
                .defaultHeaders(headers ->
                        headers.setBasicAuth(keyId, keySecret)
                )
                .build();
    }
}