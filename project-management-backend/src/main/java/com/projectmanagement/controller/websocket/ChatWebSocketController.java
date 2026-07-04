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
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        String senderEmail = resolveSender(principal, headerAccessor);
        if (senderEmail == null) {
            log.warn(
                "Rejected chat message for project {} because no authenticated user was available",
                projectId
            );
            return;
        }

        log.info(
            "Message from {} to project {}",
            senderEmail, projectId
        );

        MessageResponse message =
            messageService.sendMessage(
                projectId,
                senderEmail,
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
        @DestinationVariable UUID projectId,
        @Payload TypingPayload payload,
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        String senderEmail = resolveSender(principal, headerAccessor);
        if (senderEmail == null) {
            log.warn(
                "Rejected typing event for project {} because no authenticated user was available",
                projectId
            );
            return;
        }

        TypingResponse response = TypingResponse.builder()
            .userId(payload.getUserId())
            .userName(senderEmail)
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
    // Call Request
    // ============================
    @MessageMapping("/project/{projectId}/call.request")
    public void requestCall(
        @DestinationVariable UUID projectId,
        @Payload CallRequestPayload payload,
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        String senderEmail = resolveSender(principal, headerAccessor);
        if (senderEmail == null) {
            log.warn(
                "Rejected call request for project {} because no authenticated user was available",
                projectId
            );
            return;
        }

        CallEventResponse response = CallEventResponse.builder()
            .event("REQUEST")
            .type(payload.getType())
            .from(senderEmail)
            .message("Incoming " + payload.getType() + " call from " + senderEmail)
            .build();

        messagingTemplate.convertAndSend(
            "/topic/project/" + projectId + "/call",
            response
        );
    }

    @MessageMapping("/project/{projectId}/call.event")
    public void handleCallEvent(
        @DestinationVariable UUID projectId,
        @Payload CallEventPayload payload,
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        String senderEmail = resolveSender(principal, headerAccessor);
        if (senderEmail == null) {
            log.warn(
                "Rejected call event for project {} because no authenticated user was available",
                projectId
            );
            return;
        }

        CallEventResponse response = CallEventResponse.builder()
            .event(payload.getEvent())
            .type(payload.getType())
            .from(senderEmail)
            .message(payload.getEvent() + " for " + (payload.getType() == null ? "call" : payload.getType()))
            .candidate(payload.getCandidate())
            .sdp(payload.getSdp())
            .build();

        messagingTemplate.convertAndSend(
            "/topic/project/" + projectId + "/call",
            response
        );
    }

    // ============================
    // User Online Status
    // ============================
    @MessageMapping("/project/{projectId}/user.join")
    public void userJoin(
        @DestinationVariable UUID projectId,
        SimpMessageHeaderAccessor headerAccessor,
        Principal principal
    ) {
        String username = resolveSender(principal, headerAccessor);
        if (username == null) {
            log.warn(
                "Rejected join event for project {} because no authenticated user was available",
                projectId
            );
            return;
        }

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
        @DestinationVariable UUID projectId,
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = resolveSender(principal, headerAccessor);
        if (username == null) {
            return;
        }

        OnlineStatusResponse status =
            OnlineStatusResponse.builder()
                .username(username)
                .status("OFFLINE")
                .build();

        messagingTemplate.convertAndSend(
            "/topic/project/" +
            projectId +
            "/user.status",
            status
        );
    }

    private String resolveSender(
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        if (principal != null && principal.getName() != null) {
            return principal.getName();
        }

        if (headerAccessor != null && headerAccessor.getSessionAttributes() != null) {
            Object username = headerAccessor.getSessionAttributes().get("username");
            if (username instanceof String value && !value.isBlank()) {
                return value;
            }
        }

        return null;
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

    @lombok.Data
    public static class CallRequestPayload {
        private String type;
    }

    @lombok.Data
    public static class CallEventPayload {
        private String event;
        private String type;
        private Object candidate;
        private Object sdp;
    }

    @lombok.Data
    @lombok.Builder
    public static class CallEventResponse {
        private String event;
        private String type;
        private String from;
        private String message;
        private Object candidate;
        private Object sdp;
    }
}
