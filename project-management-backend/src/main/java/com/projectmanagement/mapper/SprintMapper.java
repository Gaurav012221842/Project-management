package com.projectmanagement.mapper;

import com.projectmanagement.dto.response.sprint.SprintResponse;
import com.projectmanagement.entity.Sprint;
import com.projectmanagement.enums.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class SprintMapper {

    public SprintResponse toResponse(Sprint sprint) {
        long completedTasks = sprint.getTasks().stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();
        int completedPoints = sprint.getTasks().stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE && t.getStoryPoints() != null)
                .mapToInt(t -> t.getStoryPoints())
                .sum();
        int totalPoints = sprint.getTasks().stream()
                .filter(t -> t.getStoryPoints() != null)
                .mapToInt(t -> t.getStoryPoints())
                .sum();

        return SprintResponse.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .goal(sprint.getGoal())
                .status(sprint.getStatus())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .totalTasks(sprint.getTasks().size())
                .completedTasks((int) completedTasks)
                .totalStoryPoints(totalPoints)
                .completedStoryPoints(completedPoints)
                .createdAt(sprint.getCreatedAt())
                .build();
    }
}
