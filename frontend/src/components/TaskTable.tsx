import type { Task } from "../types/task";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function formatStatus(status: Task["status"]): string {
  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatDate(dateValue: string): string {
  const dateOnly = dateValue.includes("T")
    ? dateValue.split("T")[0]
    : dateValue;
  const date = new Date(`${dateOnly}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateOnly;
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

export default function TaskTable({
  tasks,
  onEdit,
  onDelete
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>
          Try changing your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="task-table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>

                {task.description && (
                  <p className="task-description">
                    {task.description}
                  </p>
                )}
              </td>

              <td>
                <span
                  className={`badge priority-${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </td>

              <td>
                <span
                  className={`badge status-${task.status.toLowerCase()}`}
                >
                  {formatStatus(task.status)}
                </span>
              </td>

              <td>{formatDate(task.due_date)}</td>

              <td>
                {new Intl.DateTimeFormat("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit"
                }).format(new Date(task.updated_at))}
              </td>

              <td>
                <div className="task-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDelete(task)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
