package com.projectmanagement.repository;

import com.projectmanagement.entity.Project;
import com.projectmanagement.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository 
    extends JpaRepository<Project, UUID> {

    @Query("SELECT p FROM Project p " +
           "JOIN p.members pm " +
           "WHERE pm.user.id = :userId")
    Page<Project> findByMemberUserId(
        UUID userId, Pageable pageable
    );

    @Query("SELECT p FROM Project p " +
           "WHERE p.workspace.id = :workspaceId")
    Page<Project> findByWorkspaceId(UUID workspaceId, Pageable pageable);

    @Query("SELECT p FROM Project p " +
           "WHERE p.owner.id = :userId")
    List<Project> findByOwnerId(UUID userId);

    @Query("SELECT p FROM Project p " +
           "WHERE p.owner.id = :userId")
    Page<Project> findByOwnerId(UUID userId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Project p " +
           "WHERE p.owner.id = :userId")
    Long countByOwnerId(UUID userId);

    boolean existsByNameAndWorkspaceId(
        String name, UUID workspaceId
    );
}
