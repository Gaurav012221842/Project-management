package com.projectmanagement.dto.request.ai;

import lombok.Data;
import java.util.List;

@Data
public class GenerateSprintGoalRequest {

    private String       sprintName;
    private List<String> plannedTasks;
    private String       projectContext;
    private String       previousSprintGoal;
}
