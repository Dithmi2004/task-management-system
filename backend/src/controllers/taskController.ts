import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import {createTask, deleteTask, getTaskById, getTaskSummary,getTasksByUserId, updateTask} from "../services/taskService.js";
import type { TaskPriority, TaskStatus } from "../interfaces/task.interface.js";

interface TaskRequestBody {
    title: string;
    description?: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
}

function sendValidationErrors(
    req: Request,
    res: Response
): boolean {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array()
        });

        return true;
    }

    return false;
}

export async function createTaskController(
    req: Request,
    res: Response
): Promise<void> {
    if (sendValidationErrors(req, res)) {
        return;
    }

    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

        return;
    }

    const body = req.body as TaskRequestBody;

    const task = await createTask({
        userId: req.user.id,
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        dueDate: body.dueDate
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: task
    });
}

export async function getTasksController(
    req: Request,
    res: Response
): Promise<void> {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

        return;
    }

    const search =
        typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;

    const status =
        typeof req.query.status === "string"
            ? req.query.status
            : undefined;

    const priority =
        typeof req.query.priority === "string"
            ? req.query.priority
            : undefined;

    const sort =
        typeof req.query.sort === "string"
            ? req.query.sort
            : undefined;

    const allowedStatuses: TaskStatus[] = [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED"
    ];

    const allowedPriorities: TaskPriority[] = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ];

    const allowedSortValues = [
        "newest",
        "oldest",
        "dueDate"
    ] as const;

    if (
        status &&
        !allowedStatuses.includes(status as TaskStatus)
    ) {
        res.status(400).json({
            success: false,
            message:
                "Status must be PENDING, IN_PROGRESS, or COMPLETED."
        });

        return;
    }

    if (
        priority &&
        !allowedPriorities.includes(priority as TaskPriority)
    ) {
        res.status(400).json({
            success: false,
            message: "Priority must be LOW, MEDIUM, or HIGH."
        });

        return;
    }

    if (
        sort &&
        !allowedSortValues.includes(
            sort as (typeof allowedSortValues)[number]
        )
    ) {
        res.status(400).json({
            success: false,
            message:
                "Sort must be newest, oldest, or dueDate."
        });

        return;
    }

    const tasks = await getTasksByUserId(req.user.id, {
        search: search || undefined,
        status: status as TaskStatus | undefined,
        priority: priority as TaskPriority | undefined,
        sort: sort as
            | "newest"
            | "oldest"
            | "dueDate"
            | undefined
    });

    res.status(200).json({
        success: true,
        message: "Tasks retrieved successfully.",
        data: tasks
    });
}

export async function getTaskSummaryController(
    req: Request,
    res: Response
): Promise<void> {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

        return;
    }

    const summary = await getTaskSummary(req.user.id);

    res.status(200).json({
        success: true,
        message: "Task summary retrieved successfully.",
        data: summary
    });
}

export async function getTaskController(
    req: Request,
    res: Response
): Promise<void> {
    if (sendValidationErrors(req, res)) {
        return;
    }

    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

        return;
    }

    const taskId = Number(req.params.id);
    const task = await getTaskById(taskId, req.user.id);

    if (!task) {
        res.status(404).json({
            success: false,
            message: "Task not found."
        });

        return;
    }

    res.status(200).json({
        success: true,
        message: "Task retrieved successfully.",
        data: task
    });
}

export async function updateTaskController(
    req: Request,
    res: Response
): Promise<void> {
    if (sendValidationErrors(req, res)) {
        return;
    }

    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

        return;
    }

    const taskId = Number(req.params.id);
    const body = req.body as TaskRequestBody;

    const task = await updateTask(taskId, req.user.id, {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        dueDate: body.dueDate
    });

    if (!task) {
        res.status(404).json({
            success: false,
            message: "Task not found."
        });

        return;
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        data: task
    });
}

export async function deleteTaskController(
    req: Request,
    res: Response
): Promise<void> {
    if (sendValidationErrors(req, res)) {
        return;
    }

    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

        return;
    }

    const taskId = Number(req.params.id);
    const deleted = await deleteTask(taskId, req.user.id);

    if (!deleted) {
        res.status(404).json({
            success: false,
            message: "Task not found."
        });

        return;
    }

    res.status(200).json({
        success: true,
        message: "Task deleted successfully."
    });
}
