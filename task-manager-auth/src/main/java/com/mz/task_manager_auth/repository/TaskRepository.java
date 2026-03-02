package com.mz.task_manager_auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mz.task_manager_auth.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Spring Data JPA translates this into: SELECT * FROM tasks WHERE user_id = ?
    List<Task> findByUserId(Long userId);
}