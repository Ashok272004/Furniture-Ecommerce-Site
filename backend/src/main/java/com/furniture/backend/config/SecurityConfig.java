package com.furniture.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of("http://localhost:*", "http://127.0.0.1:*")
        );
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityContextRepository securityContextRepository
    ) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .securityContext(context ->
                    context.securityContextRepository(securityContextRepository)
            )
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                    .requestMatchers("/api/orders/my/**").authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/orders/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasRole("ADMIN")

                    .requestMatchers("/api/payments/razorpay/**").authenticated()

                    .requestMatchers(HttpMethod.POST, "/api/admin/uploads")
                    .hasRole("ADMIN")
                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/products",
                            "/api/products/**"
                    ).hasRole("ADMIN")
                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/products",
                            "/api/products/**"
                    ).hasRole("ADMIN")
                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/products",
                            "/api/products/**"
                    ).hasRole("ADMIN")

                    .anyRequest().permitAll()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}