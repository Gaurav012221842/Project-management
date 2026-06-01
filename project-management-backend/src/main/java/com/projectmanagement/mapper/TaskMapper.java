package com.projectmanagement.mapper;

import com.projectmanagement.dto.response.task.TaskResponse;
import com.projectmanagement.entity.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskMapper {

    private final UserMapper userMapper;

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId().toString())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .type(task.getType())
                .projectId(task.getProject().getId().toString())
                .sprintId(task.getSprint() != null ? task.getSprint().getId().toString() : null)
                .assignee(userMapper.toSummary(task.getAssignee()))
                .reporter(userMapper.toSummary(task.getReporter()))
                .storyPoints(task.getStoryPoints())
                .dueDate(task.getDueDate())
                .commentCount(task.getComments().size())
                .attachmentCount(task.getAttachments().size())
                .subTaskCount(task.getSubTasks().size())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
