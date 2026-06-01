package com.projectmanagement.dto.response.ai;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIBugAnalysisResponse {
    private String       severity;
    private String       rootCause;
    private List<String> possibleFixes;
    private List<String> preventionTips;
    private String       suggestedPriority;
    private Integer      estimatedFixTime;
    private String       affectedArea;
}