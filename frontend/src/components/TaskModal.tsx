import axios from "axios";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState
} from "react";
import type {
  Task,
  TaskFormValues
} from "../types/task";

interface TaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

interface FormErrors {
  title?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  general?: string;
}

function getToday(): string {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
}

const emptyForm: TaskFormValues = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  dueDate: getToday()
};

export default function TaskModal({
  isOpen,
  task,
  onClose,
  onSubmit
}: TaskModalProps) {
  const [formValues, setFormValues] =
    useState<TaskFormValues>(emptyForm);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (task) {
        setFormValues({
          title: task.title,
          description: task.description ?? "",
          priority: task.priority,
          status: task.status,
          dueDate: task.due_date
        });
      } else {
        setFormValues({
          ...emptyForm,
          dueDate: getToday()
        });
      }

      setErrors({});
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, task]);

  if (!isOpen) {
    return null;
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ): void {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
      general: undefined
    }));
  }

  function validateForm(): boolean {
    const nextErrors: FormErrors = {};
    const today = getToday();

    if (!formValues.title.trim()) {
      nextErrors.title = "Title is required.";
    } else if (formValues.title.trim().length > 150) {
      nextErrors.title =
        "Title cannot exceed 150 characters.";
    }

    if (!formValues.priority) {
      nextErrors.priority = "Priority is required.";
    }

    if (!formValues.status) {
      nextErrors.status = "Status is required.";
    }

    if (!formValues.dueDate) {
      nextErrors.dueDate = "Due date is required.";
    } else if (formValues.dueDate < today) {
      nextErrors.dueDate =
        "Due date cannot be earlier than today.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await onSubmit({
        ...formValues,
        title: formValues.title.trim(),
        description: formValues.description.trim()
      });
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const responseErrors =
          requestError.response?.data?.errors;

        if (Array.isArray(responseErrors)) {
          const backendErrors: FormErrors = {};

          for (const error of responseErrors) {
            const field = error.path as keyof FormErrors;

            if (
              field === "title" ||
              field === "priority" ||
              field === "status" ||
              field === "dueDate"
            ) {
              backendErrors[field] = error.msg;
            }
          }

          if (Object.keys(backendErrors).length > 0) {
            setErrors(backendErrors);
          } else {
            setErrors({
              general:
                requestError.response?.data?.message ??
                "Unable to save the task."
            });
          }
        } else {
          setErrors({
            general:
              requestError.response?.data?.message ??
              "Unable to save the task."
          });
        }
      } else {
        setErrors({
          general: "An unexpected error occurred."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="task-modal-header">
          <div>
            <h2 id="task-modal-title">
              {task ? "Edit Task" : "Add New Task"}
            </h2>

            <p>
              {task
                ? "Update the selected task information."
                : "Enter the details for your new task."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close task form"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="form-error-banner" role="alert">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="task-title">
              Title <span aria-hidden="true">*</span>
            </label>

            <input
              id="task-title"
              name="title"
              type="text"
              maxLength={150}
              value={formValues.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />

            {errors.title && (
              <p className="field-error">{errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
          </div>

          <div className="task-form-grid">
            <div className="form-group">
              <label htmlFor="task-priority">
                Priority <span aria-hidden="true">*</span>
              </label>

              <select
                id="task-priority"
                name="priority"
                value={formValues.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

              {errors.priority && (
                <p className="field-error">
                  {errors.priority}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="task-status">
                Status <span aria-hidden="true">*</span>
              </label>

              <select
                id="task-status"
                name="status"
                value={formValues.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
              </select>

              {errors.status && (
                <p className="field-error">
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date">
              Due Date <span aria-hidden="true">*</span>
            </label>

            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              min={getToday()}
              value={formValues.dueDate}
              onChange={handleChange}
            />

            {errors.dueDate && (
              <p className="field-error">
                {errors.dueDate}
              </p>
            )}
          </div>

          <div className="task-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : task
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
