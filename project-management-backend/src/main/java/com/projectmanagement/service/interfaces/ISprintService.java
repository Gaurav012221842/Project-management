package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.sprint.CreateSprintRequest;
import com.projectmanagement.dto.request.sprint.UpdateSprintRequest;
import com.projectmanagement.dto.response.sprint.SprintResponse;
import com.projectmanagement.entity.User;

import java.util.List;
import java.util.UUID;

public interface ISprintService {

    SprintResponse createSprint(UUID projectId, CreateSprintRequest request, User user);

    List<SprintResponse> getSprints(UUID projectId, User user);

    SprintResponse getSprintById(UUID projectId, UUID sprintId, User user);

    SprintResponse updateSprint(UUID projectId, UUID sprintId, UpdateSprintRequest request, User user);

    void deleteSprint(UUID projectId, UUID sprintId, User user);

    SprintResponse startSprint(UUID projectId, UUID sprintId, User user);

    SprintResponse completeSprint(UUID projectId, UUID sprintId, User user);
}