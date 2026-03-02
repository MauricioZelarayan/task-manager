package com.mz.task_manager_auth.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mz.task_manager_auth.model.Task;
import com.mz.task_manager_auth.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Endpoint to create a task: POST http://localhost:8080/api/tasks
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, Principal principal) {
        // principal.getName() extracts the username directly from the JWT signature
        Task newTask = taskService.createTask(task, principal.getName());
        return ResponseEntity.ok(newTask);
    }

    // Endpoint to retrieve personal tasks: GET http://localhost:8080/api/tasks
    @GetMapping
    public ResponseEntity<List<Task>> getMyTasks(Principal principal) {
        List<Task> myTasks = taskService.getTasksByUser(principal.getName());
        return ResponseEntity.ok(myTasks);
    }

    // Endpoint to update task status: PUT http://localhost:8080/api/tasks/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails, Principal principal) {
        // Uses the ID from the URL, 'completed' status from the JSON, and user from the Token
        Task updatedTask = taskService.updateTaskStatus(id, taskDetails.getCompleted(), principal.getName());
        return ResponseEntity.ok(updatedTask);
    }

    // Endpoint for task deletion: DELETE http://localhost:8080/api/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Principal principal) {
        taskService.deleteTask(id, principal.getName());
        // Returns 204 No Content: indicates successful operation with no further body to return
        return ResponseEntity.noContent().build();
    }
}