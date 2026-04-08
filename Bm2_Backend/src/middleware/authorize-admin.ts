import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate-user";

const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - no user profile found",
    });
    return;
  }

  // Check if role is ADMIN
  // Note: Ensure your JWT payload and Customer model have a 'role' field
  if ((req.user as any).role !== "ADMIN") {
    res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
    });
    return;
  }

  next();
};

export default authorizeAdmin;
