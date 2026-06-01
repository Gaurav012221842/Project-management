package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class AIChatRequest {

    @NotBlank(message = "Message is required")
    private String message;

    private List<ChatMessage> history;
    private String            projectContext;

    @Data
    public static class ChatMessage {
        private String role;    // "user" or "assistant"
        private String content;
    }
}