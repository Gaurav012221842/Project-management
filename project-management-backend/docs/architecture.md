# Architecture

## Overview
Project Management Backend is a RESTful API built with Spring Boot 3.x, following a layered architecture.

## Tech Stack
- **Framework**: Spring Boot 3.x (Java 21)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **File Storage**: AWS S3
- **Real-time**: WebSocket (STOMP)
- **Auth**: JWT (Access + Refresh tokens)
- **DB Migrations**: Flyway
- **Docs**: SpringDoc OpenAPI (Swagger)
- **Email**: Spring Mail (SMTP)

## Layer Architecture

```
Controller Layer  →  Service Layer  →  Repository Layer  →  Database
      ↕                   ↕
   DTOs              Domain Entities
```

### Layers
1. **Controller** – Handles HTTP requests, validates input, delegates to services
2. **Service** – Business logic, transaction management
3. **Repository** – Data access via Spring Data JPA
4. **Entity** – JPA entities mapped to DB tables
5. **DTO** – Data Transfer Objects for request/response

## Security Flow
```
Request → RateLimitingFilter → JwtAuthenticationFilter → SecurityConfig → Controller
```

## WebSocket Architecture
```
Client → /ws (STOMP) → ChatWebSocketController / NotificationWebSocketController
                     → /topic/chat/{workspaceId}
                     → /topic/notifications/{userId}
```

## Key Design Decisions
- **Service Interfaces**: All services implement interfaces for loose coupling and testability
- **Global Exception Handler**: Centralized error handling via `GlobalExceptionHandler`
- **BaseEntity**: All entities extend `BaseEntity` with `createdAt`/`updatedAt` audit fields
- **Flyway Migrations**: Database schema versioned and managed via SQL migrations
- **Async Processing**: `@Async` on notification/email delivery for non-blocking operations
- **Event-Driven**: Spring Application Events for decoupled notification dispatch
