import { TaskStatus } from '../../types/task';

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: 'Pending',
  IN_PROGRESS: 'In progress',
  DONE: 'Completed',
};

export const allowedAttachmentTypes = 'image/jpeg,image/png,image/webp,application/pdf';
