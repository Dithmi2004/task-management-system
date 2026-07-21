import type { ResultSetHeader } from "mysql2";
import { pool } from "../config/db.js";
import { DEFAULT_TASK_STATUS } from "../constants/taskConstants.js";
import type {
  CreateTaskInput,
  TaskQueryOptions,
  TaskRow,
  TaskSummaryRow,
  UpdateTaskInput
} from "../interfaces/task.interface.js";

export async function createTask(
    input: CreateTaskInput,
): Promise<TaskRow | null> {
    const status = input.status ?? DEFAULT_TASK_STATUS;

    const [result] = await pool.execute<ResultSetHeader>(
        `
      INSERT INTO tasks (
        user_id,
        title,
        description,
        priority,
        status,
        due_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        [
            input.userId,
            input.title,
            input.description ?? null,
            input.priority,
            status,
            input.dueDate,
        ],
    );

    return getTaskById(result.insertId, input.userId);
}

export async function getTasksByUserId(
  userId: number,
  options: TaskQueryOptions = {}
): Promise<TaskRow[]> {
  const conditions: string[] = ["user_id = ?"];
  const values: Array<string | number> = [userId];

  if (options.search) {
    conditions.push("title LIKE ?");
    values.push(`%${options.search}%`);
  }

  if (options.status) {
    conditions.push("status = ?");
    values.push(options.status);
  }

  if (options.priority) {
    conditions.push("priority = ?");
    values.push(options.priority);
  }

  let orderBy = "created_at DESC";

  if (options.sort === "oldest") {
    orderBy = "created_at ASC";
  }

  if (options.sort === "dueDate") {
    orderBy = "due_date ASC";
  }

  const query = `
    SELECT
      id,
      user_id,
      title,
      description,
      priority,
      status,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
  `;

  const [rows] = await pool.execute<TaskRow[]>(query, values);

  return rows;
}

export async function getTaskSummary(
  userId: number
): Promise<TaskSummaryRow> {
  const [rows] = await pool.execute<TaskSummaryRow[]>(
    `
      SELECT
        COUNT(*) AS totalTasks,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pendingTasks,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS inProgressTasks,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completedTasks,
        SUM(CASE WHEN priority = 'HIGH' THEN 1 ELSE 0 END) AS highPriorityTasks,
        SUM(
          CASE
            WHEN due_date < CURRENT_DATE()
              AND status <> 'COMPLETED'
            THEN 1
            ELSE 0
          END
        ) AS overdueTasks
      FROM tasks
      WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0];
}

export async function getTaskById(
    taskId: number,
    userId: number,
): Promise<TaskRow | null> {
    const [rows] = await pool.execute<TaskRow[]>(
        `
      SELECT
        id,
        user_id,
        title,
        description,
        priority,
        status,
        due_date,
        created_at,
        updated_at
      FROM tasks
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
    `,
        [taskId, userId],
    );

    return rows[0] ?? null;
}

export async function updateTask(
    taskId: number,
    userId: number,
    input: UpdateTaskInput,
): Promise<TaskRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
        `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        priority = ?,
        status = ?,
        due_date = ?
      WHERE id = ?
        AND user_id = ?
    `,
        [
            input.title,
            input.description ?? null,
            input.priority,
            input.status,
            input.dueDate,
            taskId,
            userId,
        ],
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getTaskById(taskId, userId);
}

export async function deleteTask(
    taskId: number,
    userId: number,
): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
        `
      DELETE FROM tasks
      WHERE id = ?
        AND user_id = ?
    `,
        [taskId, userId],
    );

    return result.affectedRows > 0;
}
