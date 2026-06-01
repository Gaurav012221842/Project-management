package com.projectmanagement.controller.websocket;

import com.projectmanagement.dto.request.message
    .SendMessageRequest;
import com.projectmanagement.dto.response.message
    .MessageResponse;
import com.projectmanagement.service.interfaces
    .IMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final IMessageService      messageService;
    private final SimpMessagingTemplate messagingTemplate;

    // ============================
    // Send Message
    // ============================
    @MessageMapping("/project/{projectId}/chat.send")
    public void sendMessage(
        @DestinationVariable UUID projectId,
        @Payload SendMessageRequest request,
        Principal principal
    ) {
        log.info(
            "Message from {} to project {}",
            principal.getName(), projectId
        );

        MessageResponse message =
            messageService.sendMessage(
                projectId,
                principal.getName(),
                request
            );

        // Broadcast to all subscribers
        messagingTemplate.convertAndSend(
            "/topic/project/" + projectId + "/chat",
            message
        );
    }

    // ============================
    // Typing Indicator
    // ============================
    @MessageMapping("/project/{projectId}/chat.typing")
    public void typing(
        @DestinationVariable Long projectId,
        @Payload TypingPayload payload,
        Principal principal
    ) {
        TypingResponse response = TypingResponse.builder()
            .userId(payload.getUserId())
            .userName(principal.getName())
            .isTyping(payload.isTyping())
            .build();

        // Broadcast typing status (excluding sender)
        messagingTemplate.convertAndSend(
            "/topic/project/" +
            projectId +
            "/chat.typing",
            response
        );
    }

    // ============================
    // User Online Status
    // ============================
    @MessageMapping("/project/{projectId}/user.join")
    public void userJoin(
        @DestinationVariable Long projectId,
        SimpMessageHeaderAccessor headerAccessor,
        Principal principal
    ) {
        String username = principal.getName();
        headerAccessor
            .getSessionAttributes()
            .put("username", username);
        headerAccessor
            .getSessionAttributes()
            .put("projectId", projectId);

        OnlineStatusResponse status =
            OnlineStatusResponse.builder()
                .username(username)
                .status("ONLINE")
                .build();

        messagingTemplate.convertAndSend(
            "/topic/project/" +
            projectId +
            "/user.status",
            status
        );

        log.info("{} joined project {}", 
            username, projectId
        );
    }

    @MessageMapping("/project/{projectId}/user.leave")
    public void userLeave(
        @DestinationVariable Long projectId,
        Principal principal
    ) {
        OnlineStatusResponse status =
            OnlineStatusResponse.builder()
                .username(principal.getName())
                .status("OFFLINE")
                .build();

        messagingTemplate.convertAndSend(
            "/topic/project/" +
            projectId +
            "/user.status",
            status
        );
    }

    // ============================
    // Inner Classes
    // ============================
    @lombok.Data
    public static class TypingPayload {
        private Long    userId;
        private boolean isTyping;
    }

    @lombok.Data
    @lombok.Builder
    public static class TypingResponse {
        private Long    userId;
        private String  userName;
        private boolean isTyping;
    }

    @lombok.Data
    @lombok.Builder
    public static class OnlineStatusResponse {
        private String username;
        private String status;
    }
}