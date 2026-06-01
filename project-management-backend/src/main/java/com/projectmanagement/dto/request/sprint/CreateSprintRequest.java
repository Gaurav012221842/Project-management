// CreateSprintRequest.java
package com.projectmanagement.dto.request.sprint;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateSprintRequest {

    @NotBlank(message = "Sprint name is required")
    @Size(
        min     = 2,
        max     = 100,
        message = "Name must be 2-100 characters"
    )
    private String name;

    private String goal;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}

// ================================

// UpdateSprintRequest.java

// ================================
