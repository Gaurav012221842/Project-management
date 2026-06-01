package com.projectmanagement.dto.response.task;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabelResponse {
    private Long id;
    private String name;
    private String color;
}