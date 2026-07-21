import api from "../api/axiosInstance";
import type {
  Task,
  TaskFormValues,
  TaskListResponse,
  TaskQueryParams,
  TaskResponse,
  TaskSummary,
  TaskSummaryResponse
} from "../types/task";

function getDateOnly(dateValue: string): string {
  return dateValue.includes("T")
    ? dateValue.split("T")[0]
    : dateValue;
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    due_date: getDateOnly(task.due_date)
  };
}

export async function getTaskSummary(): Promise<TaskSummary> {
  const response = await api.get<TaskSummaryResponse>(
    "/tasks/summary"
  );

  return response.data.data;
}

export async function getTasks(
  params: TaskQueryParams = {}
): Promise<Task[]> {
  const response = await api.get<TaskListResponse>("/tasks", {
    params: {
      search: params.search || undefined,
      status: params.status || undefined,
      priority: params.priority || undefined,
      sort: params.sort || "newest"
    }
  });

  return response.data.data.map(normalizeTask);
}

export async function createTask(
  values: TaskFormValues
): Promise<Task> {
  const response = await api.post<TaskResponse>(
    "/tasks",
    values
  );

  return normalizeTask(response.data.data);
}

export async function updateTask(
  taskId: number,
  values: TaskFormValues
): Promise<Task> {
  const response = await api.put<TaskResponse>(
    `/tasks/${taskId}`,
    values
  );

  return normalizeTask(response.data.data);
}

export async function deleteTask(
  taskId: number
): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}
