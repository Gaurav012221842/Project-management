package com.projectmanagement.dto.response.task;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubTaskResponse {
    private Long id;
    private String title;
    private Boolean isCompleted;
    private LocalDateTime createdAt;
}