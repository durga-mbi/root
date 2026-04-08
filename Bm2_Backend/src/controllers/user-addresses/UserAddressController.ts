import { Response, NextFunction, Request } from "express";
import * as userAddressUseCase from "../../usecases/user-addresses/UserAddressUseCase";
import { AuthRequest } from "../../middleware/authenticate-user";

export const getMine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customerId = (req as AuthRequest).user?.id;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    if (!customerId) {
      res
        .status(401)
        .json({ success: false, code: "ERR_AUTH", message: "unauthorized" });
      return;
    }

    const result = await userAddressUseCase.getUserAddressesByCustomerId(
      customerId,
      limit,
      cursor,
    );

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: result.data,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const customerId = (req as AuthRequest).user?.id;

    if (isNaN(id) || !customerId) {
      res.status(400).json({
        success: false,
        code: "ERR_BAD_REQUEST",
        message: "invalid request",
      });
      return;
    }

    const address = await userAddressUseCase.getUserAddressById(id);

    if ((address as any).userId !== customerId) {
      res
        .status(403)
        .json({ success: false, code: "ERR_FORBIDDEN", message: "forbidden" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customerId = (req as AuthRequest).user?.id;
    if (!customerId) {
      res
        .status(401)
        .json({ success: false, code: "ERR_AUTH", message: "unauthorized" });
      return;
    }

    const userAddress = await userAddressUseCase.createUserAddress({
      ...req.body,
      customerId,
      createdBy: customerId,
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: userAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const customerId = (req as AuthRequest).user?.id;

    if (isNaN(id) || !customerId) {
      res.status(400).json({
        success: false,
        code: "ERR_BAD_REQUEST",
        message: "invalid request",
      });
      return;
    }

    const userAddress = await userAddressUseCase.updateUserAddress(id, {
      ...req.body,
      customerId,
      updatedBy: customerId,
    });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: userAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const customerId = (req as AuthRequest).user?.id;

    if (isNaN(id) || !customerId) {
      res.status(400).json({
        success: false,
        code: "ERR_BAD_REQUEST",
        message: "invalid request",
      });
      return;
    }

    await userAddressUseCase.deleteUserAddress(id, customerId);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
