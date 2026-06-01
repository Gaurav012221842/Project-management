package com.projectmanagement.dto.response.task;

import com.projectmanagement.dto.response.user.UserSummaryResponse;
import com.projectmanagement.enums.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private TaskType type;
    private Integer storyPoints;
    private LocalDate dueDate;
    private Integer position;
    private UserSummaryResponse assignee;
    private UserSummaryResponse reporter;
    private String projectId;
    private String sprintId;
    private Integer commentCount;
    private Integer attachmentCount;
    private Integer subTaskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}