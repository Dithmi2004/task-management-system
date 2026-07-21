import "dotenv/config";

import app from "./app.js";
import { testDatabaseConnection } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

async function startServer(): Promise<void> {
    try {
        await testDatabaseConnection();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

void startServer();