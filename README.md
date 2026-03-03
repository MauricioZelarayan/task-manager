# Full-Stack Task Manager (JWT & Docker)
A robust Full-Stack application designed for secure personal task management. 

## Key Features
* **Secure Authentication**: User registration and login system using Spring Security and JWT.
* **Full CRUD with Ownership**: Users can only manage their own tasks; ownership is validated on every request.
* **Advanced Search & Filters**: Real-time filtering by title, description, and specific dates.
* **Modern UI/UX**: Responsive dashboard featuring Skeleton Screens, dark-mode sidebar, and SweetAlert2 notifications.
* **Date Management**: Full support for creation and expiration dates with automatic status updates.

## Tech Stack
### Backend
* Java 25 (LTS) & Spring Boot 4.0.3
* Spring Security & JWT (io.jsonwebtoken)
* Spring Data JPA & PostgreSQL 16
* Maven

### Frontend
* HTML5, CSS3 & Bootstrap 5
* Vanilla JavaScript (ES6+)
* SweetAlert2 (Interactive UI)

### Infrastructure
* Docker & Docker Compose (Database persistence)

## Installation
1. Clone the repository.
2. Start the database: `docker-compose up -d`.
3. Run the backend: `mvn spring-boot:run`.
4. Open `index.html` in your browser via Live Server (Port 5500).

## License
Copyright (c) 2026 Mauricio Zelarayán. This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.