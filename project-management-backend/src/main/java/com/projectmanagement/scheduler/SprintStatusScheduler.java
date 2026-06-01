package com.projectmanagement.scheduler;

import com.projectmanagement.enums.SprintStatus;
import com.projectmanagement.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class SprintStatusScheduler {

    private final SprintRepository sprintRepository;

    @Scheduled(cron = "0 0 0 * * *") // Every day at midnight
    @Transactional
    public void autoCompleteExpiredSprints() {
        var expiredSprints = sprintRepository.findByStatusAndEndDateBefore(SprintStatus.ACTIVE, LocalDate.now());
        expiredSprints.forEach(sprint -> {
            sprint.setStatus(SprintStatus.COMPLETED);
            log.info("Auto-completed sprint: {} ({})", sprint.getName(), sprint.getId());
        });
        sprintRepository.saveAll(expiredSprints);
    }
}
