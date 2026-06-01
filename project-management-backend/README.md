# Project Management Backend

A full-featured project management REST API built with Spring Boot 3, Java 21, PostgreSQL, Redis, and WebSocket support.

## Features
- JWT authentication (access + refresh tokens)
- Workspace & project management
- Sprint planning with burndown charts
- Task management with subtasks, comments, attachments
- Real-time notifications & chat via WebSocket
- AI-powered task descriptions and priority suggestions
- File uploads via AWS S3
- Email notifications
- Role-based access control
- Rate limiting
- Flyway database migrations

## Prerequisites
- Java 21+
- Maven 3.8+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## Getting Started

### With Docker
```bash
cp .env.example .env
# Edit .env with your values
./scripts/start.sh
```

### Without Docker
```bash
cp .env.example .env
# Edit .env with your values
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## API Documentation
Swagger UI: http://localhost:9989/swagger-ui.html

## Running Tests
```bash
./mvnw test
```

## Environment Variables
See `.env.example` for all available configuration options.
