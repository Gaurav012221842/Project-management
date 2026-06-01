package com.projectmanagement.entity;

import com.projectmanagement.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "sub_tasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SubTask extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false)
    private String title;

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;
}