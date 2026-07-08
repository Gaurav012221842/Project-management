package com.projectmanagement.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {
    private UUID id;
    private String action;
    private String entityType;
    private String entityId;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;
}
