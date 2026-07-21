import type { RowDataPacket } from "mysql2";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface TaskRow extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  userId: number;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate: string;
}

export interface UpdateTaskInput {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskQueryOptions {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: "newest" | "oldest" | "dueDate";
}

export interface TaskSummaryRow extends RowDataPacket {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
}
