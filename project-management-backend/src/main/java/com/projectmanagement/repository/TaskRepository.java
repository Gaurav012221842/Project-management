package com.projectmanagement.repository;

import com.projectmanagement.entity.Task;
import com.projectmanagement.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository 
    extends JpaRepository<Task, UUID> {

    List<Task> findByProjectIdOrderByPosition(
        UUID projectId
    );

    List<Task> findByProjectIdAndStatus(
        UUID projectId, TaskStatus status
    );

    List<Task> findBySprintId(UUID sprintId);

    List<Task> findByAssigneeId(UUID userId);

    @Query("SELECT COUNT(t) FROM Task t " +
           "WHERE t.project.id = :projectId")
    Long countByProjectId(UUID projectId);

    @Query("SELECT COUNT(t) FROM Task t " +
           "WHERE t.project.id = :projectId " +
           "AND t.status = :status")
    Long countByProjectIdAndStatus(
        @Param("projectId") UUID projectId,
        @Param("status") TaskStatus status
    );

    @Query("SELECT t FROM Task t " +
           "WHERE t.project.id = :projectId " +
           "AND t.sprint IS NULL")
    List<Task> findBacklogTasks(UUID projectId);

    @Query("SELECT t FROM Task t " +
           "WHERE t.dueDate = :dueDate " +
           "AND t.status != 'DONE'")
    List<Task> findTasksDueOn(@Param("dueDate") LocalDate dueDate);
}
