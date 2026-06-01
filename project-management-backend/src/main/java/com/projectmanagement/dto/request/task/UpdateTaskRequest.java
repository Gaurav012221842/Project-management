package com.projectmanagement.dto.request.task;

import com.projectmanagement.enums.TaskPriority;
import com.projectmanagement.enums.TaskStatus;
import com.projectmanagement.enums.TaskType;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateTaskRequest {

    @Size(min = 2, max = 255)
    private String title;

    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private TaskType type;
    private UUID sprintId;
    private UUID assigneeId;
    private Integer storyPoints;
    private LocalDate dueDate;
}
