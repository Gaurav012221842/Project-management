package com.projectmanagement.dto.response.workspace;

import com.projectmanagement.dto.response.user.UserSummaryResponse;
import com.projectmanagement.enums.WorkspaceRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WorkspaceResponse {
    private String id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private UserSummaryResponse owner;
    private WorkspaceRole currentUserRole;
    private int memberCount;
    private int projectCount;
    private LocalDateTime createdAt;
}
