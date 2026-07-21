import type {
  TaskPriority,
  TaskStatus
} from "../interfaces/task.interface.js";

export const DEFAULT_TASK_STATUS: TaskStatus = "PENDING";

export const ALLOWED_TASK_STATUSES: TaskStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED"
];

export const ALLOWED_TASK_PRIORITIES: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH"
];

export const ALLOWED_TASK_SORT_VALUES = [
  "newest",
  "oldest",
  "dueDate"
] as const;

export type TaskSortValue =
  (typeof ALLOWED_TASK_SORT_VALUES)[number];
