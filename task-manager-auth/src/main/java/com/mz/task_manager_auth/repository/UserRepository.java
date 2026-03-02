package com.mz.task_manager_auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mz.task_manager_auth.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Enables searching for users by username for the authentication process
    Optional<User> findByUsername(String username);
}