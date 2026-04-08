import { Request, Response, NextFunction } from "express";
import * as cartRepo from "../../data/repositories/Cart.Repository";
import AppError from "@/errors/AppError";

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const items = await cartRepo.getCartItems(userId);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw AppError.badRequest("Product ID and quantity are required");
    }

    const item = await cartRepo.addToCart(userId, Number(productId), Number(quantity));
    res.status(200).json({ success: true, message: "Added to cart", data: item });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const { productId, quantity } = req.body;

    const item = await cartRepo.updateCartItem(userId, Number(productId), Number(quantity));
    res.status(200).json({ success: true, message: "Cart updated", data: item });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const { productId } = req.params;

    await cartRepo.removeFromCart(userId, Number(productId));
    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    await cartRepo.clearCart(userId);
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};
