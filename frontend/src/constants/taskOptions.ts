import type {
  TaskPriority,
  TaskQueryParams,
  TaskStatus,
  TaskSummary
} from "../types/task";

export const TASKS_PER_PAGE = 5;

export const emptyTaskSummary: TaskSummary = {
  totalTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  completedTasks: 0,
  overdueTasks: 0
};

export const initialTaskFilters: TaskQueryParams = {
  search: "",
  status: "",
  priority: "",
  sort: "newest"
};

export const taskPriorityOptions: Array<{
  value: TaskPriority;
  label: string;
}> = [
  {
    value: "LOW",
    label: "Low"
  },
  {
    value: "MEDIUM",
    label: "Medium"
  },
  {
    value: "HIGH",
    label: "High"
  }
];

export const taskStatusOptions: Array<{
  value: TaskStatus;
  label: string;
}> = [
  {
    value: "PENDING",
    label: "Pending"
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress"
  },
  {
    value: "COMPLETED",
    label: "Completed"
  }
];

export const taskSortOptions: Array<{
  value: NonNullable<TaskQueryParams["sort"]>;
  label: string;
}> = [
  {
    value: "newest",
    label: "Newest Created"
  },
  {
    value: "oldest",
    label: "Oldest Created"
  },
  {
    value: "dueDate",
    label: "Due Date"
  }
];

export const taskSummaryCards: Array<{
  key: keyof TaskSummary;
  title: string;
  description: string;
}> = [
  {
    key: "totalTasks",
    title: "Total Tasks",
    description: "All tasks in your account"
  },
  {
    key: "pendingTasks",
    title: "Pending",
    description: "Tasks waiting to be started"
  },
  {
    key: "inProgressTasks",
    title: "In Progress",
    description: "Tasks currently being worked on"
  },
  {
    key: "completedTasks",
    title: "Completed",
    description: "Tasks completed successfully"
  },
  {
    key: "overdueTasks",
    title: "Overdue",
    description: "Incomplete tasks past their due date"
  }
];
