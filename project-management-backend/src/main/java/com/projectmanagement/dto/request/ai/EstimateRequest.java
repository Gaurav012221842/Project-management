package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EstimateRequest {

    @NotBlank(message = "Title is required")
    private String taskTitle;

    private String taskDescription;
    private String taskType;
    private String teamSize;
    private String complexity;
}