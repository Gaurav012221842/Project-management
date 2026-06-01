package com.projectmanagement.repository;

import com.projectmanagement.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository 
    extends JpaRepository<Comment, UUID> {

    Page<Comment> findByTaskId(UUID taskId, Pageable pageable);

    List<Comment> findByTaskIdAndParentIsNull(
        UUID taskId
    );

    Long countByTaskId(UUID taskId);

    Long countByAuthorId(UUID authorId);
}