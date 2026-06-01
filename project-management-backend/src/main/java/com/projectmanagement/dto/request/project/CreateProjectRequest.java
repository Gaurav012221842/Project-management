package com.projectmanagement.dto.request.project;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 100)
    private String name;

    private String description;

    @NotNull(message = "Workspace ID is required")
    private UUID workspaceId;

    private LocalDate startDate;
    private LocalDate endDate;
    private List<UUID> memberIds;
}