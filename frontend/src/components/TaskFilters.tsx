import type {
  TaskPriority,
  TaskQueryParams,
  TaskStatus
} from "../types/task";

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
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
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
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
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
          <option value="newest">Newest Created</option>
          <option value="oldest">Oldest Created</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <button
        type="button"
        className="reset-filter-button"
        onClick={() =>
          onChange({
            search: "",
            status: "",
            priority: "",
            sort: "newest"
          })
        }
      >
        Reset
      </button>
    </section>
  );
}
