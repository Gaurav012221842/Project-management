package com.projectmanagement.event.publisher;

import com.projectmanagement.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public void publish(Notification notification) {
        eventPublisher.publishEvent(notification);
    }
}
