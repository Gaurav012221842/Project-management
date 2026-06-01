package com.projectmanagement.dto.response.ai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIDescriptionResponse {
    private String generatedDescription;
    private String model;
}
