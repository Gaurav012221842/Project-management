package com.projectmanagement.dto.response.ai;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AITextResponse {
    private String text;
    private Integer tokensUsed;
    private String model;
}