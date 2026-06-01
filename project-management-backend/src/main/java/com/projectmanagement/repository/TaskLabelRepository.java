package com.projectmanagement.repository;

import com.projectmanagement.entity.TaskLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskLabelRepository extends JpaRepository<TaskLabel, UUID> {
    List<TaskLabel> findByTaskId(UUID taskId);
    void deleteByTaskIdAndLabelId(UUID taskId, UUID labelId);
}
