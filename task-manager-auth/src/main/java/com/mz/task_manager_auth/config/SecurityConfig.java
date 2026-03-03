package com.mz.task_manager_auth.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            
            // Restrict origins to specific development URLs for enhanced security
            // This replaces the wildcard "*" to prevent unauthorized cross-origin access
            config.setAllowedOrigins(List.of(
                "http://127.0.0.1:5500", 
                "http://localhost:5500"
            )); 
            
            // Define the HTTP methods permitted for the application's CRUD operations
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            
            // Specify required headers for JWT authentication and JSON data processing
            config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
            
            // Allow the browser to include credentials (e.g., cookies or auth headers) in cross-origin requests
            config.setAllowCredentials(true);
            
            return config;
        }))
        .csrf(csrf -> csrf.disable()) // CSRF protection is disabled as it is not needed for stateless JWT APIs
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**", "/error").permitAll() // Set authentication and error endpoints as public
            .anyRequest().authenticated() // Ensure all other routes require a valid JWT for access
        )
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Enforce stateless sessions for JWT compliance
        )
        // Inject the custom JWT authentication filter before the standard UsernamePassword filter
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
    return http.build();
}
}