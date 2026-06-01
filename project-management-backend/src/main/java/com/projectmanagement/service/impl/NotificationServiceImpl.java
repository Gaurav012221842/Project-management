package com.projectmanagement.service.impl;

import com.projectmanagement.controller.websocket
    .NotificationWebSocketController;
import com.projectmanagement.dto.response
    .NotificationResponse;
import com.projectmanagement.dto.response.common
    .PageResponse;
import com.projectmanagement.entity.Notification;
import com.projectmanagement.entity.User;
import com.projectmanagement.enums.NotificationType;
import com.projectmanagement.exception.custom
    .ResourceNotFoundException;
import com.projectmanagement.exception.custom
    .UnauthorizedException;
import com.projectmanagement.repository
    .NotificationRepository;
import com.projectmanagement.service.interfaces
    .INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
    .Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl
    implements INotificationService {

    private final NotificationRepository
        notificationRepository;
    private final NotificationWebSocketController
        wsController;

    // ============================
    // Create & Send Notification
    // ============================
    @Override
    @Async
    @Transactional
    public NotificationResponse createNotification(
        User             recipient,
        String           title,
        String           message,
        NotificationType type,
        String           referenceId
    ) {
        Notification notification =
            Notification.builder()
                .user(recipient)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        Notification saved =
            notificationRepository
                .save(notification);

        NotificationResponse response =
            toResponse(saved);

        // Send via WebSocket
        wsController.sendToUser(
            recipient.getEmail(),
            response
        );

        // Update unread count
        Long unreadCount =
            notificationRepository
                .countByUserIdAndIsRead(
                    recipient.getId(), false
                );
        wsController.sendUnreadCount(
            recipient.getEmail(),
            unreadCount
        );

        log.info(
            "Notification created for: {}",
            recipient.getEmail()
        );

        return response;
    }

    // ============================
    // Get User Notifications
    // ============================
    @Override
    public PageResponse<NotificationResponse>
    getUserNotifications(
        UUID     userId,
        Pageable pageable
    ) {
        Page<Notification> page =
            notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                    userId, pageable
                );

        List<NotificationResponse> notifications =
            page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse
            .<NotificationResponse>builder()
            .content(notifications)
            .page(page.getNumber())
            .totalPages(page.getTotalPages())
            .totalElements(page.getTotalElements())
            .size(page.getSize())
            .first(page.isFirst())
            .last(page.isLast())
            .build();
    }

    // ============================
    // Get Unread Count
    // ============================
    @Override
    public Long getUnreadCount(UUID userId) {
        return notificationRepository
            .countByUserIdAndIsRead(userId, false);
    }

    // ============================
    // Mark One as Read
    // ============================
    @Override
    @Transactional
    public void markAsRead(
        UUID notificationId,
        UUID userId
    ) {
        Notification notification =
            notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Notification not found"
                    )
                );

        if (!notification.getUser()
                .getId().equals(userId)) {
            throw new UnauthorizedException(
                "Access denied"
            );
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);

        // Update unread count via WS
        Long count =
            notificationRepository
                .countByUserIdAndIsRead(
                    userId, false
                );
        wsController.sendUnreadCount(
            notification.getUser().getEmail(),
            count
        );
    }

    // ============================
    // Mark All as Read
    // ============================
    @Override
    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsRead(userId);

        // Update count to 0 via WS
        notificationRepository
            .findUserEmail(userId)
            .ifPresent(email ->
                wsController.sendUnreadCount(
                    email, 0L
                )
            );
    }

    // ============================
    // Delete Notification
    // ============================
    @Override
    @Transactional
    public void deleteNotification(
        UUID notificationId,
        UUID userId
    ) {
        Notification notification =
            notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Notification not found"
                    )
                );

        if (!notification.getUser()
                .getId().equals(userId)) {
            throw new UnauthorizedException(
                "Access denied"
            );
        }

        notificationRepository
            .delete(notification);
    }

    // ============================
    // Clear Read Notifications
    // ============================
    @Override
    @Transactional
    public void clearReadNotifications(UUID userId) {
        notificationRepository
            .deleteByUserIdAndIsRead(userId, true);
    }

    // ============================
    // Specific Notification Types
    // ============================

    @Override
    @Async
    public void sendTaskAssignedNotification(
        User   assignee,
        String taskTitle,
        UUID   taskId
    ) {
        createNotification(
            assignee,
            "New Task Assigned 📋",
            "You have been assigned: \"" +
                taskTitle + "\"",
            NotificationType.TASK_ASSIGNED,
            taskId != null ? taskId.toString() : null
        );
    }

    @Override
    @Async
    public void sendCommentNotification(
        User   taskOwner,
        String commenterName,
        String taskTitle,
        UUID   taskId
    ) {
        createNotification(
            taskOwner,
            "New Comment 💬",
            commenterName +
                " commented on \"" +
                taskTitle + "\"",
            NotificationType.COMMENT_ADDED,
            taskId != null ? taskId.toString() : null
        );
    }

    @Override
    @Async
    public void sendDeadlineReminderNotification(
        User   assignee,
        String taskTitle,
        UUID   taskId,
        String dueDate
    ) {
        createNotification(
            assignee,
            "Deadline Reminder ⏰",
            "Task \"" + taskTitle +
                "\" is due on " + dueDate,
            NotificationType.DEADLINE_REMINDER,
            taskId != null ? taskId.toString() : null
        );
    }

    @Override
    @Async
    public void sendSprintStartedNotification(
        List<User> members,
        String     sprintName,
        UUID       projectId
    ) {
        members.forEach(member ->
            createNotification(
                member,
                "Sprint Started 🚀",
                "Sprint \"" + sprintName +
                    "\" has started!",
                NotificationType.SPRINT_STARTED,
                projectId != null ? projectId.toString() : null
            )
        );
    }

    @Override
    @Async
    public void sendMentionNotification(
        User   mentionedUser,
        String mentionedBy,
        String context,
        UUID   referenceId
    ) {
        createNotification(
            mentionedUser,
            "You were mentioned 👋",
            mentionedBy +
                " mentioned you in " + context,
            NotificationType.MENTION,
            referenceId != null ? referenceId.toString() : null
        );
    }

    // ============================
    // Helper
    // ============================
    private NotificationResponse toResponse(
        Notification n
    ) {
        return NotificationResponse.builder()
            .id(n.getId())
            .title(n.getTitle())
            .message(n.getMessage())
            .type(n.getType())
            .referenceId(n.getReferenceId())
            .isRead(n.getIsRead())
            .createdAt(n.getCreatedAt())
            .build();
    }
}