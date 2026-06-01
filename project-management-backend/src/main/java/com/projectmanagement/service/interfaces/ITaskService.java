package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.task.*;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.task.TaskResponse;
import com.projectmanagement.entity.User;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ITaskService {
    TaskResponse createTask(UUID projectId, CreateTaskRequest request, User user);
    PageResponse<TaskResponse> getTasks(UUID projectId, User user, Pageable pageable);
    TaskResponse getTaskById(UUID id, User user);
    TaskResponse updateTask(UUID id, UpdateTaskRequest request, User user);
    TaskResponse updateTaskStatus(UUID id, UpdateTaskStatusRequest request, User user);
    TaskResponse assignTask(UUID id, AssignTaskRequest request, User user);
    void deleteTask(UUID id, User user);
}
