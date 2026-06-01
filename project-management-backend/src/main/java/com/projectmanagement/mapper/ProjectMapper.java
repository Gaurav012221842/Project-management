package com.projectmanagement.mapper;

import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.entity.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    private final UserMapper userMapper;

    public ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId().toString())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .owner(userMapper.toResponse(project.getOwner()))
                .createdAt(project.getCreatedAt())
                .build();
    }
}
