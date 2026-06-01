package com.projectmanagement.entity;

import com.projectmanagement.entity.base.BaseEntity;
import com.projectmanagement.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "workspace_id",
        nullable = false
    )
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "owner_id",
        nullable = false
    )
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @OneToMany(
        mappedBy = "project",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<ProjectMember> members = 
        new ArrayList<>();

    @OneToMany(
        mappedBy = "project",
        cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<Sprint> sprints = 
        new ArrayList<>();

    @OneToMany(
        mappedBy = "project",
        cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<Task> tasks = 
        new ArrayList<>();

    @OneToMany(
        mappedBy = "project",
        cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<Label> labels = 
        new ArrayList<>();
}