package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.workspace.AddMemberRequest;
import com.projectmanagement.dto.request.workspace.CreateWorkspaceRequest;
import com.projectmanagement.dto.request.workspace.UpdateWorkspaceRequest;
import com.projectmanagement.dto.response.workspace.WorkspaceResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.entity.Workspace;
import com.projectmanagement.entity.WorkspaceMember;
import com.projectmanagement.enums.WorkspaceRole;
import com.projectmanagement.exception.custom.DuplicateResourceException;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.exception.custom.UnauthorizedException;
import com.projectmanagement.mapper.WorkspaceMapper;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.repository.WorkspaceMemberRepository;
import com.projectmanagement.repository.WorkspaceRepository;
import com.projectmanagement.service.interfaces.INotificationService;
import com.projectmanagement.service.interfaces.IWorkspaceService;
import com.projectmanagement.utils.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements IWorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final WorkspaceMapper workspaceMapper;
    private final INotificationService notificationService;

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public WorkspaceResponse createWorkspace(CreateWorkspaceRequest request, User owner) {
        String slug = SlugUtils.toSlug(request.getName());
        if (workspaceRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .owner(owner)
                .build();

        workspace = workspaceRepository.save(workspace);

        WorkspaceMember ownerMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(owner)
                .role(WorkspaceRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();
        memberRepository.save(ownerMember);

        return workspaceMapper.toResponse(workspace);
    }

    @Override
    @Cacheable(value = "workspaces", key = "'user:' + #user.id")
    public List<WorkspaceResponse> getUserWorkspaces(User user) {
        return memberRepository.findByUserId(user.getId()).stream()
                .map(m -> workspaceMapper.toResponse(m.getWorkspace()))
                .toList();
    }

    @Override
    @Cacheable(value = "workspaces", key = "'workspace:' + #id + ':user:' + #user.id")
    public WorkspaceResponse getWorkspaceById(UUID id, User user) {
        Workspace workspace = findWorkspaceAndVerifyAccess(id, user);
        return workspaceMapper.toResponse(workspace);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public WorkspaceResponse updateWorkspace(UUID id, UpdateWorkspaceRequest request, User user) {
        Workspace workspace = findWorkspaceAndVerifyAccess(id, user);
        if (request.getName() != null) workspace.setName(request.getName());
        if (request.getDescription() != null) workspace.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) workspace.setLogoUrl(request.getLogoUrl());
        return workspaceMapper.toResponse(workspaceRepository.save(workspace));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public void deleteWorkspace(UUID id, User user) {
        Workspace workspace = findWorkspaceAndVerifyAccess(id, user);
        if (!workspace.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only workspace owner can delete it");
        }
        workspaceRepository.delete(workspace);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public void addMember(UUID workspaceId, AddMemberRequest request, User requester) {
        Workspace workspace = findWorkspaceAndVerifyAccess(workspaceId, requester);
        // FIX: Delegate to shared helper to eliminate duplicate logic with inviteMember
        doAddMember(workspace, request.getEmail(), request.getRole(), requester, false);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public void inviteMember(UUID workspaceId, String email, User requester) {
        Workspace workspace = findWorkspaceAndVerifyAccess(workspaceId, requester);
        // FIX: Delegate to shared helper with MEMBER role and invite notification
        doAddMember(workspace, email, WorkspaceRole.MEMBER, requester, true);
    }

    /**
     * FIX: Shared private helper that merges the duplicate logic from addMember() and inviteMember().
     * @param sendInviteNotification if true, sends workspace_invite; otherwise sends workspace_member_added.
     */
    private void doAddMember(Workspace workspace, String email, WorkspaceRole role,
                              User requester, boolean sendInviteNotification) {
        User userToAdd = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (memberRepository.existsByWorkspaceIdAndUserId(workspace.getId(), userToAdd.getId())) {
            throw new DuplicateResourceException("User is already a member");
        }

        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(workspace)
                .user(userToAdd)
                .role(role)
                .joinedAt(LocalDateTime.now())
                .build();
        memberRepository.save(member);

        if (sendInviteNotification) {
            notificationService.sendWorkspaceInviteNotification(
                    userToAdd, requester.getName(), workspace.getName(), workspace.getId());
        } else {
            notificationService.sendWorkspaceMemberAddedNotification(
                    userToAdd, requester.getName(), workspace.getName(), workspace.getId());
        }
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public void removeMember(UUID workspaceId, UUID userId, User requester) {
        findWorkspaceAndVerifyAccess(workspaceId, requester);
        memberRepository.deleteByWorkspaceIdAndUserId(workspaceId, userId);
    }

    private Workspace findWorkspaceAndVerifyAccess(UUID id, User user) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", "id", id));
        if (!memberRepository.existsByWorkspaceIdAndUserId(id, user.getId())) {
            throw new UnauthorizedException("Access denied to this workspace");
        }
        return workspace;
    }
}
