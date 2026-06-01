package com.projectmanagement.controller.websocket;

import com.projectmanagement.dto.response
    .NotificationResponse;
import com.projectmanagement.service.interfaces
    .INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp
    .SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationWebSocketController {

    private final SimpMessagingTemplate
        messagingTemplate;

    // ============================
    // Send to specific user
    // ============================
    public void sendToUser(
        String  userEmail,
        NotificationResponse notification
    ) {
        messagingTemplate.convertAndSendToUser(
            userEmail,
            "/queue/notifications",
            notification
        );

        log.info(
            "Notification sent to: {}",
            userEmail
        );
    }

    // ============================
    // Broadcast to project members
    // ============================
    public void broadcastToProject(
        Long   projectId,
        Object payload
    ) {
        messagingTemplate.convertAndSend(
            "/topic/project/" +
            projectId +
            "/notifications",
            payload
        );
    }

    // ============================
    // Send unread count update
    // ============================
    public void sendUnreadCount(
        String userEmail,
        Long   count
    ) {
        messagingTemplate.convertAndSendToUser(
            userEmail,
            "/queue/notifications/count",
            count
        );
    }
}