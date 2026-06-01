package com.projectmanagement.scheduler;

import com.projectmanagement.entity.Task;
import com.projectmanagement.enums.TaskStatus;
import com.projectmanagement.repository
    .TaskRepository;
import com.projectmanagement.service.interfaces
    .INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation
    .Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeadlineReminderScheduler {

    private final TaskRepository        taskRepository;
    private final INotificationService  notificationService;

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDeadlineReminders() {
        log.info("Running deadline reminder check...");

        LocalDate tomorrow =
            LocalDate.now().plusDays(1);

        List<Task> dueTasks =
            taskRepository
                .findTasksDueOn(tomorrow)
                .stream()
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .collect(java.util.stream.Collectors.toList());

        DateTimeFormatter fmt =
            DateTimeFormatter.ofPattern("MMM dd, yyyy");

        dueTasks.forEach(task -> {
            if (task.getAssignee() != null) {
                notificationService
                    .sendDeadlineReminderNotification(
                        task.getAssignee(),
                        task.getTitle(),
                        task.getId(),
                        tomorrow.format(fmt)
                    );
            }
        });

        log.info(
            "Sent {} deadline reminders",
            dueTasks.size()
        );
    }
}