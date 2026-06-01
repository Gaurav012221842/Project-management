// GenerateDescriptionRequest.java
package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenerateDescriptionRequest {

    @NotBlank(message = "Task title is required")
    private String taskTitle;

    private String projectContext;
    private String taskType;
    private String additionalContext;
}
