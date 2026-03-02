package com.mz.task_manager_auth;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class TaskManagerAuthApplication {

    @PostConstruct
    public void init() {
        // Force the Java application to use UTC globally
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        // Set default timezone as the first line to ensure 100% consistency
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(TaskManagerAuthApplication.class, args);
    }
}