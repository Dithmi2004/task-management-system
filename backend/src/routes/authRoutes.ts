import { Router } from "express";
import { login } from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginValidator } from "../validators/authValidator.js";

const router = Router();

router.post("/login", loginValidator, asyncHandler(login));

export default router;