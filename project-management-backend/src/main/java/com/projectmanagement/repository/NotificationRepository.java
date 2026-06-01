package com.projectmanagement.repository;

import com.projectmanagement.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository
    .JpaRepository;
import org.springframework.data.jpa.repository
    .Modifying;
import org.springframework.data.jpa.repository
    .Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository
    extends JpaRepository<Notification, UUID> {

    Page<Notification>
    findByUserIdOrderByCreatedAtDesc(
        UUID userId, Pageable pageable
    );

    Long countByUserIdAndIsRead(
        UUID userId, Boolean isRead
    );

    @Modifying
    @Query(
        "UPDATE Notification n " +
        "SET n.isRead = true " +
        "WHERE n.user.id = :userId"
    )
    void markAllAsRead(UUID userId);

    @Modifying
    @Query(
        "DELETE FROM Notification n " +
        "WHERE n.user.id = :userId " +
        "AND n.isRead = :isRead"
    )
    void deleteByUserIdAndIsRead(
        UUID userId, Boolean isRead
    );

    @Query(
        "SELECT u.email FROM User u " +
        "WHERE u.id = :userId"
    )
    Optional<String> findUserEmail(UUID userId);
}