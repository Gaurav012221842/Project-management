package com.projectmanagement.service;

import com.projectmanagement.dto.request.task.CreateTaskRequest;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.repository.*;
import com.projectmanagement.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void createTask_ShouldThrow_WhenProjectNotFound() {
        UUID projectId = UUID.randomUUID();
        User user = User.builder().id(UUID.randomUUID()).build();
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Test Task");

        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.createTask(projectId, request, user))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
