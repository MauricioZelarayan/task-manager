package com.mz.task_manager_auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mz.task_manager_auth.model.User;
import com.mz.task_manager_auth.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Endpoint: POST http://localhost:8080/auth/register
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = authService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    // Endpoint: POST http://localhost:8080/auth/login
    @PostMapping("/login")
    public ResponseEntity<com.mz.task_manager_auth.model.AuthResponse> login(@RequestBody User user) {
        return ResponseEntity.ok(authService.login(user));
    }
}