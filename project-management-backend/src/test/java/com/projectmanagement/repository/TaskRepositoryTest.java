package com.projectmanagement.repository;

import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.User;
import com.projectmanagement.entity.Workspace;
import com.projectmanagement.enums.Role;
import com.projectmanagement.enums.TaskStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Test
    void countByProjectIdAndStatus_ShouldReturnCorrectCount() {
        User owner = userRepository.save(User.builder()
                .email("owner@example.com")
                .name("owner")
                .password("encoded").role(Role.DEVELOPER).build());

        Workspace workspace = workspaceRepository.save(Workspace.builder()
                .name("WS").slug("ws").owner(owner).build());

        Project project = projectRepository.save(Project.builder()
                .name("Project").workspace(workspace).build());

        taskRepository.save(Task.builder().project(project).title("Task 1").status(TaskStatus.TODO).build());
        taskRepository.save(Task.builder().project(project).title("Task 2").status(TaskStatus.TODO).build());
        taskRepository.save(Task.builder().project(project).title("Task 3").status(TaskStatus.DONE).build());

        long todoCount = taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.TODO);
        assertThat(todoCount).isEqualTo(2);
    }
}
