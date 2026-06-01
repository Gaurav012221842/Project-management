package com.projectmanagement.repository;

import com.projectmanagement.entity.Sprint;
import com.projectmanagement.enums.SprintStatus;
import org.springframework.data.jpa.repository
    .JpaRepository;
import org.springframework.data.jpa.repository
    .Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SprintRepository
    extends JpaRepository<Sprint, UUID> {

    List<Sprint>
    findByProjectIdOrderByStartDate(
        UUID projectId
    );

    Optional<Sprint>
    findByProjectIdAndStatus(
        UUID         projectId,
        SprintStatus status
    );

    boolean existsByNameAndProjectId(
        String name,
        UUID   projectId
    );

    @Query(
        "SELECT COUNT(s) FROM Sprint s " +
        "WHERE s.project.id = :projectId " +
        "AND s.status = :status"
    )
    Long countByProjectIdAndStatus(
        UUID         projectId,
        SprintStatus status
    );

    List<Sprint> findByStatusAndEndDateBefore(
        SprintStatus status,
        LocalDate endDate
    );
}