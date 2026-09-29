import type { Priority, Status } from '@/data/dummy';

// Database memakai bahasa Inggris, tampilan memakai bahasa Indonesia.
export const priorityLabel: Record<Priority, string> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
};

export const statusLabel: Record<Status, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Selesai',
};