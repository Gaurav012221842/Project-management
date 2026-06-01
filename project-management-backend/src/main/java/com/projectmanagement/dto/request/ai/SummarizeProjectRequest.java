package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SummarizeProjectRequest {

    @NotNull(message = "Project ID is required")
    private java.util.UUID projectId;

    private String focusArea;
}