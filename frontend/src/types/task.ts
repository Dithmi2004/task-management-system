export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface TaskSummaryResponse {
  success: boolean;
  message: string;
  data: TaskSummary;
}

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: Task[];
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TaskQueryParams {
  search?: string;
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  sort?: "newest" | "oldest" | "dueDate";
}
