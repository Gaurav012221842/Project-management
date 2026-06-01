package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class SuggestAssigneeRequest {

    @NotBlank(message = "Title is required")
    private String taskTitle;

    private String       taskDescription;
    private String       taskType;
    private List<String> teamMembers;
    private List<String> memberSkills;
}