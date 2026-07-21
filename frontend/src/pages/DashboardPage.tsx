import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { toast } from "react-toastify";
import DashboardHeader from "../components/DashboardHeader";
import PaginationControls from "../components/PaginationControls";
import TaskFilters from "../components/TaskFilters";
import TaskModal from "../components/TaskModal";
import TaskSummaryGrid from "../components/TaskSummaryGrid";
import TaskTable from "../components/TaskTable";
import {
  authMessages,
  taskMessages
} from "../constants/messages";
import {
  emptyTaskSummary,
  initialTaskFilters,
  TASKS_PER_PAGE
} from "../constants/taskOptions";
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
import { getRequestErrorMessage } from "../utils/errorUtils";
import {
  getPaginatedItems,
  getTotalPages
} from "../utils/paginationUtils";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [summary, setSummary] =
    useState<TaskSummary>(emptyTaskSummary);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] =
    useState<TaskQueryParams>(initialTaskFilters);
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
      setError(taskMessages.loadSummaryFailed);
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
      setError(
        getRequestErrorMessage(
          requestError,
          taskMessages.loadTasksFailed
        )
      );
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

  const totalPages = getTotalPages(
    tasks.length,
    TASKS_PER_PAGE
  );
  const activePage = Math.min(currentPage, totalPages);

  const paginatedTasks = useMemo(() => {
    return getPaginatedItems(
      tasks,
      activePage,
      TASKS_PER_PAGE
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

      toast.success(taskMessages.deleteSuccess);

      await Promise.all([
        loadTasks(),
        loadSummary()
      ]);
    } catch (requestError) {
      toast.error(
        getRequestErrorMessage(
          requestError,
          taskMessages.deleteFailed
        )
      );
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
      authMessages.logoutConfirm
    );

    if (!confirmed) {
      return;
    }

    logout();
    toast.success(authMessages.logoutSuccess);
  }

  async function handleSaveTask(
    values: TaskFormValues
  ): Promise<void> {
    if (selectedTask) {
      await updateTask(selectedTask.id, values);

      toast.success(taskMessages.updateSuccess);
    } else {
      await createTask(values);

      toast.success(taskMessages.createSuccess);
    }

    handleCloseTaskModal();

    await Promise.all([
      loadTasks(),
      loadSummary()
    ]);
  }

  return (
    <main className="dashboard-page">
      <DashboardHeader
        userName={user?.name ?? "User"}
        onLogout={handleLogout}
      />

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
        <TaskSummaryGrid summary={summary} />
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

        <PaginationControls
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
