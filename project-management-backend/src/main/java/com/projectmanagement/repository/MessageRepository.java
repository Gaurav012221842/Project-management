package com.projectmanagement.repository;

import com.projectmanagement.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository
    .JpaRepository;
import org.springframework.data.jpa.repository
    .Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface MessageRepository
    extends JpaRepository<Message, UUID> {

    Page<Message> findByWorkspaceIdOrderByCreatedAtDesc(
        UUID workspaceId,
        Pageable pageable
    );

    @Query(
        "SELECT m FROM Message m " +
        "WHERE m.workspace.id = :workspaceId " +
        "AND LOWER(m.content) LIKE " +
        "LOWER(CONCAT('%', :query, '%'))"
    )
    Page<Message> searchInWorkspace(
        UUID workspaceId,
        String query,
        Pageable pageable
    );

    Long countByWorkspaceId(UUID workspaceId);
}