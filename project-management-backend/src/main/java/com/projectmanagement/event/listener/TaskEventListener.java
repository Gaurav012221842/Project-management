package com.projectmanagement.event.listener;

import com.projectmanagement.entity.Task;
import com.projectmanagement.service.impl.ActivityLogServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskEventListener {

    private final ActivityLogServiceImpl activityLogService;

    @Async
    @EventListener
    public void onTaskEvent(Task task) {
        // Placeholder: log task-related domain events
        // In real usage, create typed event objects (TaskCreatedEvent, TaskUpdatedEvent, etc.)
    }
}
