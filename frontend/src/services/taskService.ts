import api from "../api/axiosInstance";
import type {
  TaskSummary,
  TaskSummaryResponse
} from "../types/task";

export async function getTaskSummary(): Promise<TaskSummary> {
  const response = await api.get<TaskSummaryResponse>(
    "/tasks/summary"
  );

  return response.data.data;
}
