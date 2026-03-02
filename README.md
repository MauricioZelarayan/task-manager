Full-Stack Task Manager (JWT & Docker)
A robust Full-Stack application designed for secure personal task management. This project features a Spring Boot REST API protected by JWT (JSON Web Tokens) and a modern, responsive Vanilla JavaScript dashboard.

Features
Secure Authentication: User registration and login system using Spring Security and JWT.

Task Management (CRUD): Create, read, update (mark as completed), and delete tasks.

Ownership Protection: Users can only access and modify their own tasks; the system validates the JWT claims for every request.

Responsive UI: A clean dashboard with a sidebar, task cards, and interactive modals built with Bootstrap 5.

Task Metadata: Allows users to set a creation date for each task.

Data Persistence: PostgreSQL database running in a Docker container with persistent volumes.

Tech Stack
Backend
Java 25 (LTS)

Spring Boot 4.0.3

Spring Security & JWT (io.jsonwebtoken)

Spring Data JPA (Hibernate)

PostgreSQL 16

Frontend
HTML5 & CSS3

Bootstrap 5 (UI Framework)

Vanilla JavaScript (ES6+)

Infrastructure & Tools
Docker & Docker Compose

Maven (Dependency Management)

Installation & Setup
1. Prerequisites
Docker and Docker Compose installed.

Java 25 JDK.

Maven.

2. Database Setup (Docker)
Run the following command in the root directory to start the PostgreSQL container:

Bash
docker-compose up -d
3. Backend Configuration
Ensure your src/main/resources/application.properties matches your Docker credentials:

Properties
spring.datasource.url=jdbc:postgresql://localhost:5432/task_db
spring.datasource.username=user
spring.datasource.password=pass
4. Run the Application
Execute the Spring Boot application using Maven:

Bash
mvn spring-boot:run
Frontend Usage
Navigate to the task-manager-frontend/ folder.

Open index.html in your preferred web browser.

Register a new user account.

Login to receive your JWT token (automatically stored in localStorage).

Manage your tasks through the interactive Dashboard.

Author
Mauricio Zelarayán– Systems Development Student