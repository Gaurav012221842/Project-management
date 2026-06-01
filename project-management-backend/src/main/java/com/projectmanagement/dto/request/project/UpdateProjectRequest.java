package com.projectmanagement.dto.request.project;

import com.projectmanagement.enums.ProjectStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProjectRequest {

    @Size(min = 2, max = 100)
    private String name;

    @Size(max = 1000)
    private String description;

    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
}
