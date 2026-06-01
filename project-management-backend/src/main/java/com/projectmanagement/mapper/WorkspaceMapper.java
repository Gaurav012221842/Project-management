package com.projectmanagement.mapper;

import com.projectmanagement.dto.response.workspace.WorkspaceResponse;
import com.projectmanagement.entity.Workspace;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkspaceMapper {

    private final UserMapper userMapper;

    public WorkspaceResponse toResponse(Workspace workspace) {
        return WorkspaceResponse.builder()
                .id(workspace.getId().toString())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .description(workspace.getDescription())
                .logoUrl(workspace.getLogoUrl())
                .owner(userMapper.toSummary(workspace.getOwner()))
                .memberCount(workspace.getMembers().size())
                .projectCount(workspace.getProjects().size())
                .createdAt(workspace.getCreatedAt())
                .build();
    }
}
