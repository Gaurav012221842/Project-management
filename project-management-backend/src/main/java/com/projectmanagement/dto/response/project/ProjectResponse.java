package com.projectmanagement.dto.response.project;

import com.projectmanagement.dto.response.user.UserResponse;
import com.projectmanagement.enums.ProjectStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private String id;
    private String name;
    private String description;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private UserResponse owner;
    private List<UserResponse> members;
    private ProjectStatsResponse stats;
    private LocalDateTime createdAt;
}
