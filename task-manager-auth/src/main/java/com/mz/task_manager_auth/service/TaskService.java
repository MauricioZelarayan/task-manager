package com.mz.task_manager_auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mz.task_manager_auth.model.Task;
import com.mz.task_manager_auth.model.User;
import com.mz.task_manager_auth.repository.TaskRepository;
import com.mz.task_manager_auth.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Task createTask(Task task, String username) {
        // 1. Fetch user from DB using the username extracted from the JWT token
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // 2. Link the user to the task
        task.setUser(user);

        // 3. Force "completed" to false if it arrives as null
        if (task.getCompleted() == null) {
            task.setCompleted(false);
        }
        
        // 4. Persist the task
        return taskRepository.save(task);
    }

    public List<Task> getTasksByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return taskRepository.findByUserId(user.getId());
    }

    public Task updateTaskStatus(Long taskId, Boolean completed, String username) {
        // Search task by its ID
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        // Ownership verification: ensure the user has permission to modify this specific task
        if (!task.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Acceso denegado: No tienes permiso para modificar esta tarea");
        }
        
        // Update and persist changes
        task.setCompleted(completed);
        return taskRepository.save(task);
    }

    // --- DELETE TASK LOGIC ---
    public void deleteTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        // Verify ownership before deletion
        if (!task.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Acceso denegado: No tienes permiso para eliminar esta tarea");
        }
        
        taskRepository.delete(task);
    }
}