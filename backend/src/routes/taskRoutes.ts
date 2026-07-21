import { Router } from "express";
import {
    createTaskController, deleteTaskController, getTaskController,
    getTaskSummaryController, getTasksController, updateTaskController
} from "../controllers/taskController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { taskIdValidator, taskValidator } from "../validators/taskValidator.js";

const router = Router();

router.use(authenticateUser);

router.get(
    "/summary",
    asyncHandler(getTaskSummaryController)
);

router.get("/", asyncHandler(getTasksController));

router.get(
    "/:id",
    taskIdValidator,
    asyncHandler(getTaskController)
);

router.post(
    "/",
    taskValidator,
    asyncHandler(createTaskController)
);

router.put(
    "/:id",
    [...taskIdValidator, ...taskValidator],
    asyncHandler(updateTaskController)
);

router.delete(
    "/:id",
    taskIdValidator,
    asyncHandler(deleteTaskController)
);

export default router;
