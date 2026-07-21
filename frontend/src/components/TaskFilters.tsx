import type {
  TaskPriority,
  TaskQueryParams,
  TaskStatus
} from "../types/task";
import {
  initialTaskFilters,
  taskPriorityOptions,
  taskSortOptions,
  taskStatusOptions
} from "../constants/taskOptions";

interface TaskFiltersProps {
  filters: TaskQueryParams;
  onChange: (filters: TaskQueryParams) => void;
}

export default function TaskFilters({
  filters,
  onChange
}: TaskFiltersProps) {
  function updateFilter(
    name: keyof TaskQueryParams,
    value: string
  ): void {
    onChange({
      ...filters,
      [name]: value
    });
  }

  return (
    <section className="task-filters">
      <div className="filter-field search-field">
        <label htmlFor="task-search">Search</label>

        <input
          id="task-search"
          type="search"
          placeholder="Search by task title"
          value={filters.search ?? ""}
          onChange={(event) =>
            updateFilter("search", event.target.value)
          }
        />
      </div>

      <div className="filter-field">
        <label htmlFor="status-filter">Status</label>

        <select
          id="status-filter"
          value={filters.status ?? ""}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value as TaskStatus | ""
            )
          }
        >
          <option value="">All statuses</option>
          {taskStatusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="priority-filter">Priority</label>

        <select
          id="priority-filter"
          value={filters.priority ?? ""}
          onChange={(event) =>
            updateFilter(
              "priority",
              event.target.value as TaskPriority | ""
            )
          }
        >
          <option value="">All priorities</option>
          {taskPriorityOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="sort-filter">Sort</label>

        <select
          id="sort-filter"
          value={filters.sort ?? "newest"}
          onChange={(event) =>
            updateFilter("sort", event.target.value)
          }
        >
          {taskSortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="reset-filter-button"
        onClick={() => onChange(initialTaskFilters)}
      >
        Reset
      </button>
    </section>
  );
}
