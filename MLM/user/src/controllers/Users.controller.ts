import AppError from "@/errors/AppError";
import { NextFunction, Request, Response } from "express";
import type { getUserByIdResDTO } from "../dto";
import { AuthRequest } from "../middleware/authenticate-user";
import * as userService from "../useCase/Users.useCase";
export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user as getUserByIdResDTO,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log("This controller is being hit");
    const users = await userService.getAllUsers();

    const responseUsers: getUserByIdResDTO[] = users.map((user) => ({
      id: user.id,
      uId: user.uId,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      memberId: user.memberId ?? "",
      legPosition: user.legPosition ?? "",
      status: user.status,
      kycStatus: user.kycStatus,
    }));

    res.status(200).json({
      success: true,
      data: responseUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;
    const user = await userService.getUserById(userId);

    const responseUser: getUserByIdResDTO = {
      id: user.id,
      uId: user.uId,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      memberId: user.memberId ?? "",
      legPosition: user.legPosition ?? "",
      status: user.status,
      kycStatus: user.kycStatus,
    };

    res.status(200).json({
      success: true,
      data: responseUser,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;

    const updatedUser = await userService.updateUser(userId, req.body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;
    await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

//Helper Controller
export const getDownline = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;

    const users = await userService.getAllDownlineByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Downline users fetched successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpline = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;

    const users = await userService.getAllUpLineByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Upline users fetched successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDirectsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw AppError.unauthorized("User not authenticated");
    }
    const result = await userService.getMyDirectsUsecase(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getLastNodeByLegController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;
    const legPosition = req.body.legPosition as "LEFT" | "RIGHT";

    if (!["LEFT", "RIGHT"].includes(legPosition)) {
      throw AppError.badRequest("Invalid legPosition");
    }

    const lastNode = await userService.updateLastNodeByLeg(userId, legPosition);

    if (!lastNode) {
      throw AppError.badRequest("No node found for the given leg");
    }

    res.status(200).json({
      success: true,
      data: lastNode,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamCount = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = res.locals.user?.id;

    if (!userId) {
      throw AppError.unauthorized("User not authenticated");
    }

    const result = await userService.getTeamStats(userId);

    res.status(200).json({
      success: true,
      message: "Team count fetched successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const getUserUplineProfileController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw AppError.unauthorized("User not authenticated");
    }
    const result = await userService.getUserUplineUsecase(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getUserDirectsProfileController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw AppError.unauthorized("User not authenticated");
    }
    const result = await userService.getUserDirectsUsecase(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
