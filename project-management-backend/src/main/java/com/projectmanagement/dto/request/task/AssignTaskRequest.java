package com.projectmanagement.dto.request.task;

import lombok.Data;

import java.util.UUID;

@Data
public class AssignTaskRequest {
    private UUID assigneeId;
}
