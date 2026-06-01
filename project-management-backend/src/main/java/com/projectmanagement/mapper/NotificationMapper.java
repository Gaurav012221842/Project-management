package com.projectmanagement.mapper;

import com.projectmanagement.entity.Notification;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationMapper {

    public Map<String, Object> toMap(Notification notification) {
        return Map.of(
                "id", notification.getId().toString(),
                "type", notification.getType().name(),
                "title", notification.getTitle(),
                "message", notification.getMessage() != null ? notification.getMessage() : "",
                "read", notification.getIsRead(),
                "referenceId", notification.getReferenceId() != null ? notification.getReferenceId().toString() : "",
                "createdAt", notification.getCreatedAt().toString()
        );
    }
}
