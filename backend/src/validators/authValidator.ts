import { body } from "express-validator";

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required."),
];
