package com.projectmanagement.dto.response.ai;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAssigneeResponse {
    private String            suggestedAssignee;
    private String            reason;
    private Integer           confidence;
    private List<String>      alternativeAssignees;
    private List<String>      requiredSkills;
}
