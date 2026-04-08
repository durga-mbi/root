import config from "@/config";
import {
  findById,
  findByMobile,
  findByUsername,
  logoutRepo,
  storeRefreshToken,
} from "@/data/repositories/Auth.admin.repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generatetoken";
import { MyJwtPayload } from "@/middleware/verifyToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "@/errors/AppError";
import CustomError from "@/errors/CustomError";

export const loginUsecase = async (identifier: string, password: string) => {
  try {
    let existAdmin = await findByUsername(identifier);

    if (!existAdmin) {
      existAdmin = await findByMobile(identifier);
    }

    if (!existAdmin) {
      throw AppError.unauthorized("Invalid credentials");
    }

    if (existAdmin.status === "0") {
      throw AppError.forbidden(
        "Your account is inactive. Please contact support.",
      );
    }

    const isPassword = await bcrypt.compare(password, existAdmin.password);
    if (!isPassword) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const accessToken = await generateAccessToken(
      existAdmin.id,
      existAdmin.adminType,
    );
    const refreshToken = await generateRefreshToken(existAdmin.id);
    await storeRefreshToken(existAdmin.id, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw AppError.internal(
      error.message || "Something went wrong during login",
    );
  }
};

export const genAcessUsecase = async (refreshToken: string) => {
  try {
    const decoded: any = jwt.verify(refreshToken, config.jwtRefreshSecret);

    if (!decoded?.id) {
      throw AppError.forbidden("Invalid token");
    }

    const admin = await findById(decoded.id);

    if (!admin) {
      throw AppError.notFound("Admin not found");
    }

    if (admin.status === "0") {
      throw AppError.forbidden(
        "Your account is inactive. Please contact support.",
      );
    }

    if (admin.refreshToken !== refreshToken) {
      throw AppError.forbidden("Invalid refresh token");
    }

    return generateAccessToken(admin.id, admin.adminType);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw AppError.forbidden("Invalid or expired refresh token");
  }
};

export const logoutUsecase = async (id: number) => {
  if (!id) {
    throw new Error("id is required");
  }
  await logoutRepo(id);
  return true;
};
