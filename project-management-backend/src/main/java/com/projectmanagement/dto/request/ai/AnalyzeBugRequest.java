package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnalyzeBugRequest {

    @NotBlank(message = "Bug description required")
    private String bugDescription;

    private String errorLog;
    private String affectedComponent;
    private String stepsToReproduce;
    private String projectContext;
}
