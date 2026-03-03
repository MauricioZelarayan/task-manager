package com.mz.task_manager_auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mz.task_manager_auth.model.Role;
import com.mz.task_manager_auth.model.User;
import com.mz.task_manager_auth.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;

    // Dependency injection via constructor (Best Practice)
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, org.springframework.security.authentication.AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public User register(User user) {
        // Encrypt the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Assign default role if none is provided
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        
        // Save user to PostgreSQL database
        return userRepository.save(user);
    }

    public com.mz.task_manager_auth.model.AuthResponse login(User request) {
        // Handles user and password verification automatically through Spring Security
        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // If authentication succeeds, find user and generate the JWT token
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);
        
        return new com.mz.task_manager_auth.model.AuthResponse(token);
    }
}