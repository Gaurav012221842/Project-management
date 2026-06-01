package com.projectmanagement.dto.response.ai;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIEstimateResponse {
    private Integer storyPoints;
    private String  complexityLevel;
    private String  reason;
    private String  timeEstimate;
    private Integer confidence;
}