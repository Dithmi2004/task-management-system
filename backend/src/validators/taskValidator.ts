import { body, param } from "express-validator";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const taskIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Task ID must be a positive integer.")
];

export const taskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters."),

  body("description")
    .optional({ nullable: true })
    .trim(),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required.")
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH."),

  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage(
      "Status must be PENDING, IN_PROGRESS, or COMPLETED."
    ),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601({ strict: true })
    .withMessage("Due date must use YYYY-MM-DD format.")
    .custom((value: string) => {
      const dueDate = new Date(`${value}T00:00:00`);

      if (Number.isNaN(dueDate.getTime())) {
        throw new Error("Due date is invalid.");
      }

      if (dueDate < today) {
        throw new Error("Due date cannot be earlier than today.");
      }

      return true;
    })
];