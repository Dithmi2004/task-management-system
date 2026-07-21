import type { SignOptions } from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";

export interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
}

export interface LoginResult {
    token: string;
    user: AuthenticatedUser;
}

export interface JwtPayload {
    id: number;
    email: string;
}

export interface JwtConfiguration {
    secret: string;
    expiresIn: SignOptions["expiresIn"];
}