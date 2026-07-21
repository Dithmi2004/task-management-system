import type { Task } from "../types/task";
import { formatDisplayDate } from "../utils/dateUtils";

interface TaskTableProps {
  tasks: Task[];
  deletingTaskId: number | null;
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

export default function TaskTable({
  tasks,
  deletingTaskId,
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

              <td>{formatDisplayDate(task.due_date)}</td>

              <td>
                {formatDisplayDate(task.updated_at)}
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
                    disabled={deletingTaskId === task.id}
                    onClick={() => onDelete(task)}
                  >
                    {deletingTaskId === task.id
                      ? "Deleting..."
                      : "Delete"}
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
