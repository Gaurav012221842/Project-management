package com.projectmanagement.dto.response.sprint;


import com.projectmanagement.enums.SprintStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SprintResponse {

    private UUID        id;
    private String      name;
    private String      goal;
    private SprintStatus status;
    private LocalDate   startDate;
    private LocalDate   endDate;
    private UUID        projectId;

    // Stats
    private Integer     totalTasks;
    private Integer     completedTasks;
    private Integer     totalStoryPoints;
    private Integer     completedStoryPoints;
    private Integer     progress;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}