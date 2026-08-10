-- V11: Fix notifications type constraint to include all current NotificationType values.
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (
    type IN (
      'TASK_ASSIGNED',
      'COMMENT_ADDED',
      'TASK_UPDATED',
      'SPRINT_STARTED',
      'MENTION',
      'DEADLINE_REMINDER',
      'WORKSPACE_INVITE',
      'WORKSPACE_MEMBER_ADDED',
      'MESSAGE_RECEIVED',
      'CALL_INVITE'
    )
  );
