package com.projectmanagement.entity;

import com.projectmanagement.entity.base.BaseEntity;
import com.projectmanagement.enums.WorkspaceRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "workspace_members",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"workspace_id", "user_id"}
    )
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class WorkspaceMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WorkspaceRole role = WorkspaceRole.MEMBER;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}