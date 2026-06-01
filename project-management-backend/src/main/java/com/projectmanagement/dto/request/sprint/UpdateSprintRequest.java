package com.projectmanagement.dto.request.sprint;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateSprintRequest {

    private String    name;
    private String    goal;
    private LocalDate startDate;
    private LocalDate endDate;
}
