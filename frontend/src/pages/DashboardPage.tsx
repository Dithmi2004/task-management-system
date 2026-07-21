import axios from "axios";
import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";
import { getTaskSummary } from "../services/taskService";
import type { TaskSummary } from "../types/task";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [summary, setSummary] =
    useState<TaskSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary(): Promise<void> {
      try {
        setError("");
        const data = await getTaskSummary();
        setSummary(data);
      } catch (requestError) {
        if (axios.isAxiosError(requestError)) {
          setError(
            requestError.response?.data?.message ??
              "Unable to load the dashboard summary."
          );
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadSummary();
  }, []);

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

      {isLoading ? (
        <section className="dashboard-loading">
          Loading dashboard summary...
        </section>
      ) : summary ? (
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
      ) : null}

      <section className="dashboard-content">
        <div>
          <h2>Recent Tasks</h2>
          <p>
            The task management table will be added in the
            next step.
          </p>
        </div>

        <button type="button" className="primary-button">
          Add New Task
        </button>
      </section>
    </main>
  );
}
