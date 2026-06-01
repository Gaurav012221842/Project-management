package com.projectmanagement.event.listener;

import com.projectmanagement.entity.Notification;
import com.projectmanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Async
    @EventListener
    public void onNotification(Notification notification) {
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(
                notification.getUser().getId().toString(),
                "/queue/notifications",
                notification);
    }
}
