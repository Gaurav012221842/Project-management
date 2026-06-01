package com.projectmanagement.dto.response.ai;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIPriorityResponse {
    private String  suggestedPriority;
    private String  reason;
    private Integer confidence;
    private String  alternativePriority;
}