import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { loginUser } from "../services/authService.js";

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array(),
    });

    return;
  }

  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const result = await loginUser(email, password);

  if (!result) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });

    return;
  }

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: result,
  });
}
