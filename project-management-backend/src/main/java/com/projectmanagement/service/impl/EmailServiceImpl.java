package com.projectmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendWelcomeEmail(String to, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        sendHtmlEmail(to, "Welcome to Project Management!", "email/welcome", context);
    }

    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        sendHtmlEmail(to, "Reset Your Password", "email/reset-password", context);
    }

    @Async
    public void sendTaskAssignedEmail(String to, String taskTitle, String assigneeName) {
        Context context = new Context();
        context.setVariable("taskTitle", taskTitle);
        context.setVariable("assigneeName", assigneeName);
        sendHtmlEmail(to, "Task Assigned: " + taskTitle, "email/task-assigned", context);
    }

    @Async
    public void sendDeadlineReminderEmail(String to, String taskTitle, String dueDate) {
        Context context = new Context();
        context.setVariable("taskTitle", taskTitle);
        context.setVariable("dueDate", dueDate);
        sendHtmlEmail(to, "Deadline Reminder: " + taskTitle, "email/deadline-reminder", context);
    }

    private void sendHtmlEmail(String to, String subject, String template, Context context) {
        try {
            String body = templateEngine.process(template, context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error, don't fail the business operation
        }
    }
}
