import axios from "axios";
import {
  useCallback,
  useEffect,
  useState
} from "react";
import SummaryCard from "../components/SummaryCard";
import TaskFilters from "../components/TaskFilters";
import TaskModal from "../components/TaskModal";
import TaskTable from "../components/TaskTable";
import { useAuth } from "../context/AuthContext";
import {
  createTask,
  deleteTask,
  getTasks,
  getTaskSummary,
  updateTask
} from "../services/taskService";
import type {
  Task,
  TaskFormValues,
  TaskQueryParams,
  TaskSummary
} from "../types/task";

const emptySummary: TaskSummary = {
  totalTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  completedTasks: 0,
  overdueTasks: 0
};

const initialFilters: TaskQueryParams = {
  search: "",
  status: "",
  priority: "",
  sort: "newest"
};

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [summary, setSummary] =
    useState<TaskSummary>(emptySummary);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] =
    useState<TaskQueryParams>(initialFilters);

  const [isSummaryLoading, setIsSummaryLoading] =
    useState(true);

  const [isTasksLoading, setIsTasksLoading] =
    useState(true);

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [error, setError] = useState("");

  const loadSummary = useCallback(async (): Promise<void> => {
    try {
      const data = await getTaskSummary();
      setSummary(data);
    } catch {
      setError("Unable to load dashboard summary.");
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      setIsTasksLoading(true);
      setError("");

      const data = await getTasks(filters);
      setTasks(data);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ??
            "Unable to load tasks."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsTasksLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSummary();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadSummary]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTasks();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadTasks]);

  async function handleDelete(task: Task): Promise<void> {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);

      await Promise.all([
        loadTasks(),
        loadSummary()
      ]);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ??
            "Unable to delete the task."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }

  function handleEdit(task: Task): void {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }

  function handleAddTask(): void {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  }

  function handleCloseTaskModal(): void {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  }

  async function handleSaveTask(
    values: TaskFormValues
  ): Promise<void> {
    if (selectedTask) {
      await updateTask(selectedTask.id, values);
    } else {
      await createTask(values);
    }

    handleCloseTaskModal();

    await Promise.all([
      loadTasks(),
      loadSummary()
    ]);
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Task Management System
          </p>

          <h1>Dashboard</h1>

          <p>
            Welcome back,{" "}
            <strong>{user?.name ?? "User"}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      {error && (
        <div className="dashboard-error" role="alert">
          {error}
        </div>
      )}

      {isSummaryLoading ? (
        <div className="dashboard-loading">
          Loading dashboard summary...
        </div>
      ) : (
        <section className="summary-grid">
          <SummaryCard
            title="Total Tasks"
            value={summary.totalTasks}
            description="All tasks in your account"
          />

          <SummaryCard
            title="Pending"
            value={summary.pendingTasks}
            description="Tasks waiting to be started"
          />

          <SummaryCard
            title="In Progress"
            value={summary.inProgressTasks}
            description="Tasks currently being worked on"
          />

          <SummaryCard
            title="Completed"
            value={summary.completedTasks}
            description="Tasks completed successfully"
          />

          <SummaryCard
            title="Overdue"
            value={summary.overdueTasks}
            description="Incomplete tasks past their due date"
          />
        </section>
      )}

      <section className="task-section">
        <div className="task-section-header">
          <div>
            <h2>Tasks</h2>
            <p>
              Search, filter, sort, edit, and delete your
              tasks.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={handleAddTask}
          >
            Add New Task
          </button>
        </div>

        <TaskFilters
          filters={filters}
          onChange={setFilters}
        />

        {isTasksLoading ? (
          <div className="dashboard-loading">
            Loading tasks...
          </div>
        ) : (
          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={(task) => {
              void handleDelete(task);
            }}
          />
        )}
      </section>

      <TaskModal
        isOpen={isTaskModalOpen}
        task={selectedTask}
        onClose={handleCloseTaskModal}
        onSubmit={handleSaveTask}
      />
    </main>
  );
}
