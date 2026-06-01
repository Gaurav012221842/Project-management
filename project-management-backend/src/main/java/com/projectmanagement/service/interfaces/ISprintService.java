package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.sprint
    .CreateSprintRequest;
import com.projectmanagement.dto.request.sprint
    .UpdateSprintRequest;
import com.projectmanagement.dto.response.sprint
    .SprintResponse;

import java.util.List;
import java.util.UUID;

public interface ISprintService {

    SprintResponse createSprint(
        UUID                projectId,
        CreateSprintRequest request
    );

    List<SprintResponse> getSprints(UUID projectId);

    SprintResponse getSprintById(
        UUID projectId,
        UUID sprintId
    );

    SprintResponse updateSprint(
        UUID                projectId,
        UUID                sprintId,
        UpdateSprintRequest request
    );

    void deleteSprint(
        UUID projectId,
        UUID sprintId
    );

    SprintResponse startSprint(
        UUID projectId,
        UUID sprintId
    );

    SprintResponse completeSprint(
        UUID projectId,
        UUID sprintId
    );
}