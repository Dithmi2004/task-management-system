import cors from "cors";
import express, {type NextFunction, type Request, type Response,} from "express";
import apiRoutes from "./routes/index.js";

const app = express();

//Middleware
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(
    cors({
        origin(origin, callback) {
            // Allows tools such as Postman and server-to-server requests
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
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

// Register all API routes
app.use("/api", apiRoutes);

// Error 404
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

// Error 500
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
});

export default app;