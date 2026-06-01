package com.projectmanagement.dto.response.task;

import com.projectmanagement.enums.TaskPriority;
import com.projectmanagement.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskSummaryResponse {
    private String id;
    private String title;
    private TaskStatus status;
    private TaskPriority priority;
    private String assigneeId;
    private String assigneeName;
}
