package com.mz.task_manager_auth.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate creationDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate expirationDate;

    public enum TaskStatus { 
    PENDING,
    COMPLETED,
    FINISHED
    }

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.PENDING;

    // Relational Mapping: Links the task to the user who created it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public java.time.LocalDate getCreationDate() { return creationDate; }
    public void setCreationDate(java.time.LocalDate creationDate) { this.creationDate = creationDate; }
}