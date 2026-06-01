package com.projectmanagement.service.impl;

import com.projectmanagement.entity.ActivityLog;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.User;
import com.projectmanagement.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl {

    private final ActivityLogRepository activityLogRepository;

    @Async
    public void log(Project project, User user, String action, String entityType, UUID entityId, String oldValue, String newValue) {
        ActivityLog log = ActivityLog.builder()
                .project(project)
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId != null ? entityId.toString() : null)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        activityLogRepository.save(log);
    }
}
