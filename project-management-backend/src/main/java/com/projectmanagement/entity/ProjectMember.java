package com.projectmanagement.entity;

import com.projectmanagement.entity.base.BaseEntity;
import com.projectmanagement.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(
    name = "project_members",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"project_id", "user_id"}
    )
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProjectMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.DEVELOPER;
}