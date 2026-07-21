import ThemeToggle from "./ThemeToggle";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

export default function DashboardHeader({
  userName,
  onLogout
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-eyebrow">
          Task Management System
        </p>

        <h1>Dashboard</h1>

        <p>
          Welcome back, <strong>{userName}</strong>.
        </p>
      </div>

      <div className="dashboard-actions">
        <ThemeToggle />

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
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
  );
}
