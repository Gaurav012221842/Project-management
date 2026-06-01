package com.projectmanagement.dto.request.task;

import com.projectmanagement.enums.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;
    private UUID sprintId;
    private UUID assigneeId;

    private TaskPriority priority = TaskPriority.MEDIUM;
    private TaskType type = TaskType.TASK;

    @Min(0) @Max(100)
    private Integer storyPoints = 0;

    private LocalDate dueDate;
    private List<UUID> labelIds;
}