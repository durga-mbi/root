import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { isTokenBlocked } from "../utils/tokenBlocklist";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    comId?: number;
    username?: string;
    mobile?: string;
    role?: string;
  };
  file?: any;
  files?: any;
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // Try to get token from cookies first, then fallback to Authorization header
  let token = req.cookies?.accessToken;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return next(
      AppError.unauthorized("authentication token is missing or invalid"),
    );
  }

  //   Check if this token was explicitly revoked (post-logout)
  if (isTokenBlocked(token)) {
    return next(AppError.unauthorized("session has been logged out"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret) as {
      id: number;
      comId?: number;
      username?: string;
      mobile?: string;
      role?: string;
    };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    next(AppError.unauthorized("session expired or invalid token"));
  }
};

export default authenticateUser;
