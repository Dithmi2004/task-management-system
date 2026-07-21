import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully.",
    data: {
      user: req.user
    }
  });
});

export default router;