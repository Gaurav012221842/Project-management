package com.projectmanagement.dto.response;

import com.projectmanagement.enums.NotificationType;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private String referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}