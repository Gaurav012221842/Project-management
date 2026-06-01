package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.response.common
    .ApiResponse;
import com.projectmanagement.dto.response.common
    .PageResponse;
import com.projectmanagement.dto.response
    .NotificationResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces
    .INotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(
    name        = "Notifications",
    description = "Notification management APIs"
)
public class NotificationController {

    private final INotificationService notificationService;

    // ============================
    // Get All Notifications
    // ============================
    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>>
    getNotifications(
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "20") int size,
        @AuthenticationPrincipal User currentUser
    ) {
        UUID userId = currentUser.getId();

        PageRequest pageable = PageRequest.of(
            page, size,
            Sort.by("createdAt").descending()
        );

        return ResponseEntity.ok(
            ApiResponse.success(
                notificationService
                    .getUserNotifications(
                        userId, pageable
                    )
            )
        );
    }

    // ============================
    // Get Unread Count
    // ============================
    @GetMapping("/unread-count")
    @Operation(summary = "Get unread count")
    public ResponseEntity<ApiResponse<Long>>
    getUnreadCount(
        @AuthenticationPrincipal User currentUser
    ) {
        UUID userId = currentUser.getId();

        return ResponseEntity.ok(
            ApiResponse.success(
                notificationService
                    .getUnreadCount(userId)
            )
        );
    }

    // ============================
    // Mark One as Read
    // ============================
    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ApiResponse<Void>>
    markAsRead(
        @PathVariable UUID id,
        @AuthenticationPrincipal User currentUser
    ) {
        notificationService.markAsRead(id, currentUser.getId());

        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Notification marked as read"
            )
        );
    }

    // ============================
    // Mark All as Read
    // ============================
    @PutMapping("/read-all")
    @Operation(summary = "Mark all as read")
    public ResponseEntity<ApiResponse<Void>>
    markAllAsRead(
        @AuthenticationPrincipal User currentUser
    ) {
        notificationService.markAllAsRead(currentUser.getId());

        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "All notifications marked as read"
            )
        );
    }

    // ============================
    // Delete Notification
    // ============================
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification")
    public ResponseEntity<ApiResponse<Void>>
    deleteNotification(
        @PathVariable UUID id,
        @AuthenticationPrincipal User currentUser
    ) {
        notificationService
            .deleteNotification(id, currentUser.getId());

        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Notification deleted"
            )
        );
    }

    // ============================
    // Delete All Read
    // ============================
    @DeleteMapping("/clear-read")
    @Operation(summary = "Clear all read notifications")
    public ResponseEntity<ApiResponse<Void>>
    clearReadNotifications(
        @AuthenticationPrincipal User currentUser
    ) {
        notificationService
            .clearReadNotifications(currentUser.getId());

        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Read notifications cleared"
            )
        );
    }
}