package com.mz.task_manager_auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mz.task_manager_auth.model.Task;
import com.mz.task_manager_auth.model.Task.TaskStatus;
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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        task.setUser(user);

        // If status is null, default it to PENDING
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        
        return taskRepository.save(task);
    }

    public List<Task> getTasksByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByUserId(user.getId());
    }

    public Task updateTask(Long taskId, Task taskDetails, String username) {
    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
    
    // Ownership validation: verify the task belongs to the user
    if (!task.getUser().getUsername().equals(username)) {
        throw new RuntimeException("Access denied: You do not have permission to modify this task");
    }
    
    // Update basic text fields
    task.setTitle(taskDetails.getTitle());
    task.setDescription(taskDetails.getDescription());
    
    // Update task status if provided
    if (taskDetails.getStatus() != null) {
        task.setStatus(taskDetails.getStatus());
    }

    // Update the creation and expiration dates with the data coming from the frontend
    task.setCreationDate(taskDetails.getCreationDate());
    task.setExpirationDate(taskDetails.getExpirationDate());
    
    return taskRepository.save(task);
}

    // --- DELETE TASK LOGIC ---
    public void deleteTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Verify ownership before deletion
        if (!task.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied: You do not have permission to delete this task");
        }
        
        taskRepository.delete(task);
    }
}