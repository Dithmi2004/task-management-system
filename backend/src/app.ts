import cors from "cors";
import express, { Request, Response } from "express";

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// Route
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Task Management API is running",
    });
});

export default app;