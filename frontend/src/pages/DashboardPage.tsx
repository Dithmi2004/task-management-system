import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { toast } from "react-toastify";
import SummaryCard from "../components/SummaryCard";
import TaskFilters from "../components/TaskFilters";
import TaskModal from "../components/TaskModal";
import TaskTable from "../components/TaskTable";
import ThemeToggle from "../components/ThemeToggle";
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

const tasksPerPage = 5;

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [summary, setSummary] =
    useState<TaskSummary>(emptySummary);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] =
    useState<TaskQueryParams>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isSummaryLoading, setIsSummaryLoading] =
    useState(true);

  const [isTasksLoading, setIsTasksLoading] =
    useState(true);

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [deletingTaskId, setDeletingTaskId] =
    useState<number | null>(null);

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

  const totalPages = Math.max(
    1,
    Math.ceil(tasks.length / tasksPerPage)
  );
  const activePage = Math.min(currentPage, totalPages);

  const paginatedTasks = useMemo(() => {
    const startIndex = (activePage - 1) * tasksPerPage;

    return tasks.slice(
      startIndex,
      startIndex + tasksPerPage
    );
  }, [activePage, tasks]);

  function handleFilterChange(
    nextFilters: TaskQueryParams
  ): void {
    setFilters(nextFilters);
    setCurrentPage(1);
  }

  async function handleDelete(task: Task): Promise<void> {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTaskId(task.id);

      await deleteTask(task.id);

      toast.success("Task deleted successfully.");

      await Promise.all([
        loadTasks(),
        loadSummary()
      ]);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        toast.error(
          requestError.response?.data?.message ??
            "Unable to delete the task."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setDeletingTaskId(null);
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

  function handleLogout(): void {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    logout();
    toast.success("Logged out successfully.");
  }

  async function handleSaveTask(
    values: TaskFormValues
  ): Promise<void> {
    if (selectedTask) {
      await updateTask(selectedTask.id, values);

      toast.success("Task updated successfully.");
    } else {
      await createTask(values);

      toast.success("Task created successfully.");
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

        <div className="dashboard-actions">
          <ThemeToggle />

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 3v18" />
            </svg>
          </button>
        </div>
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
          onChange={handleFilterChange}
        />

        {isTasksLoading ? (
          <div className="dashboard-loading">
            Loading tasks...
          </div>
        ) : (
          <TaskTable
            tasks={paginatedTasks}
            deletingTaskId={deletingTaskId}
            onEdit={handleEdit}
            onDelete={(task) => {
              void handleDelete(task);
            }}
          />
        )}

        {tasks.length > tasksPerPage && (
          <div className="pagination-controls">
            <p>
              Page {activePage} of {totalPages}
            </p>

            <div>
              <button
                type="button"
                className="pagination-button"
                disabled={activePage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    pageNumber === activePage
                      ? "pagination-button active"
                      : "pagination-button"
                  }
                  aria-current={
                    pageNumber === activePage
                      ? "page"
                      : undefined
                  }
                  onClick={() =>
                    setCurrentPage(pageNumber)
                  }
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                className="pagination-button"
                disabled={activePage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
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
