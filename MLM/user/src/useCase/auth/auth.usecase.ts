import config from "@/config";
import {
  findById,
  findByMobile,
  logoutRepo,
  storeRefreshToken,
} from "@/data/repositories/User.Auth.Repository";

import { createUserActivityLog } from "@/data/repositories/userActivity.Repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "@/errors/AppError";
import CustomError from "@/errors/CustomError";

export const loginUsecase = async (mobile: string, password: string) => {
  try {
    const existUser = await findByMobile(mobile);

    if (!existUser) {
      throw AppError.unauthorized("Invalid mobile or password");
    }

    if (existUser.status === "INACTIVE") {
      throw AppError.forbidden("Your account is inactive. Please contact support.");
    }

    const isPassword = await bcrypt.compare(password, existUser.password);

    if (!isPassword) {
      throw AppError.unauthorized("Invalid mobile or password");
    }

    const {
      password: _password,
      refreshToken: _refreshToken,
      ...safeUser
    } = existUser;

    const accessToken = await generateAccessToken(existUser.id);
    const refreshToken = await generateRefreshToken(existUser.id);

    await storeRefreshToken(existUser.id, refreshToken);

    try {
      await createUserActivityLog({
        userId: existUser.id,
        action: "LOGIN",
        details: `User logged in using mobile ${mobile}`,
      });
    } catch (logError) {
      console.error("Activity log failed:", logError);
    }

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }

    console.error("Login error:", error);
    throw AppError.internal("Something went wrong during login");
  }
};

export const generateAccessUsecase = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as {
      id: number;
    };

    const user = await findById(decoded.id);

    if (!user) {
      throw AppError.forbidden("Invalid or expired refresh token");
    }

    if (user.status === "INACTIVE") {
      throw AppError.forbidden("Your account is inactive. Please contact support.");
    }

    if (user.refreshToken !== refreshToken) {
      throw AppError.forbidden("Invalid or expired refresh token");
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await storeRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw AppError.forbidden("Invalid or expired refresh token");
  }
};

export const logoutUsecase = async (id: number) => {
  if (!id) {
    throw AppError.badRequest("User id is required");
  }

  await logoutRepo(id);
  return true;
};
