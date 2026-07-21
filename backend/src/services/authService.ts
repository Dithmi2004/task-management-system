import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { pool } from "../config/db.js";
import type { JwtConfiguration, JwtPayload, LoginResult, UserRow, } from "../interfaces/auth.interface.js";

// Check JWT configuration
function getJwtConfiguration(): JwtConfiguration {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT configuration is incomplete. JWT_SECRET is required.");
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]);
    return {
        secret: jwtSecret,
        expiresIn,
    };
}

// Generate JWT token
function generateAccessToken(user: UserRow): string {
    const { secret, expiresIn } = getJwtConfiguration();
    const payload: JwtPayload = {
        id: user.id,
        email: user.email,
    };
    const options: SignOptions = {
        expiresIn,
    };
    return jwt.sign(payload, secret, options);
}

// Get by email
async function findUserByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.execute<UserRow[]>(
        `SELECT id, name, email, password
            FROM users 
            WHERE email = ?
            LIMIT 1
        `,
        [email],
    );
    return rows[0] ?? null;
}

// login
export async function loginUser(email: string, password: string): Promise<LoginResult | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
        return null;
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        return null;
    }
    const token = generateAccessToken(user);
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}
