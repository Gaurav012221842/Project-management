package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.response
    .NotificationResponse;
import com.projectmanagement.dto.response.common
    .PageResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.enums.NotificationType;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface INotificationService {

    NotificationResponse createNotification(
        User             recipient,
        String           title,
        String           message,
        NotificationType type,
        String           referenceId
    );

    PageResponse<NotificationResponse>
    getUserNotifications(
        UUID     userId,
        Pageable pageable
    );

    Long getUnreadCount(UUID userId);

    void markAsRead(UUID notificationId, UUID userId);

    void markAllAsRead(UUID userId);

    void deleteNotification(
        UUID notificationId,
        UUID userId
    );

    void clearReadNotifications(UUID userId);

    void sendTaskAssignedNotification(
        User   assignee,
        String taskTitle,
        UUID   taskId
    );

    void sendCommentNotification(
        User   taskOwner,
        String commenterName,
        String taskTitle,
        UUID   taskId
    );

    void sendDeadlineReminderNotification(
        User   assignee,
        String taskTitle,
        UUID   taskId,
        String dueDate
    );

    void sendSprintStartedNotification(
        java.util.List<User> members,
        String               sprintName,
        UUID                 projectId
    );

    void sendMentionNotification(
        User   mentionedUser,
        String mentionedBy,
        String context,
        UUID   referenceId
    );

    void sendWorkspaceInviteNotification(
        User   invitedUser,
        String inviterName,
        String workspaceName,
        UUID   workspaceId
    );

    void sendWorkspaceMemberAddedNotification(
        User   member,
        String addedByName,
        String workspaceName,
        UUID   workspaceId
    );

    void sendMessageNotification(
        UUID   projectId,
        String senderEmail,
        String preview
    );

    void sendCallInviteNotification(
        UUID   projectId,
        String callerEmail,
        String callType
    );
}
