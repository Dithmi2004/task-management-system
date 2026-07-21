import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface AuthTokenPayload extends JwtPayload {
    id: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

export function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Authentication token is required.",
        });

        return;
    }

    const token = authorizationHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing.");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;

        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token.",
        });
    }
}
