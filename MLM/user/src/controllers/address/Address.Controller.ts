import { Request, Response, NextFunction } from "express";
import * as addressRepo from "../../data/repositories/Address.Repository";
import AppError from "@/errors/AppError";

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const addresses = await addressRepo.getUserAddresses(userId);
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const data = req.body;

    const address = await addressRepo.createUserAddress({
      ...data,
      userId,
    });
    res.status(201).json({ success: true, message: "Address added", data: address });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const address = await addressRepo.updateAddress(Number(id), data);
    res.status(200).json({ success: true, message: "Address updated", data: address });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await addressRepo.deleteAddress(Number(id));
    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    next(error);
  }
};
