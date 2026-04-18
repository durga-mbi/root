import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate-user";
import { CartRepository } from "../../data/repositories/cart/CartRepository";
import prisma from "../../prisma-client";
import { getProductMainImage } from "../../utils/product-image";

const cartRepository = new CartRepository();

// ---------------- Helper ----------------
const enrichCartItem = (item: any) => {
  const price = item.product?.stockItems?.[0]?.saleRate || 0;
  const itemTotal = price * item.quantity;
  const mainImage = getProductMainImage(item.product);

  return {
    cartId: item.cartId,
    id: item.product?.id,
    productId: item.productId,
    productName: item.product?.productName,
    productImage: mainImage,
    image: mainImage,
    quantity: item.quantity,
    price: price,
    itemTotal: Number(itemTotal.toFixed(2)),
  };
};


// ---------------- Add to Cart ----------------
export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let comId = req.user!.comId;

    if (!comId) {
      const customer = await prisma.customer.findUnique({
        where: { id: req.user!.id },
      });
      comId = customer?.comId;
    }

    if (!comId) {
      res.status(401).json({
        success: false,
        message: "User identity (comId) could not be verified. Please log in again.",
      });
      return;
    }


    let productId = req.body.productId || req.body.ItemId;
    const quantity = req.body.quantity;

    // 🔥 HANDLE STRING PRODUCT INPUT
    if (!productId && req.body.product) {
      const text = req.body.product;

      const barcodeMatch = text.match(/Barcode:\s*(\d+)/);
      if (!barcodeMatch) {
        res.status(400).json({
          success: false,
          message: "Invalid product format",
        });
        return;
      }

      const barcode = barcodeMatch[1];

      let stock = await prisma.shopStockItem.findFirst({
        where: { barCode: barcode },
      });

      if (stock && stock.productId) {
        productId = stock.productId;
      } else {
        const nameMatch = text.match(/^(.+?)\s*\(/);
        const mrpMatch = text.match(/MRP:\s*(\d+)/);
        const brandMatch = text.match(/Brand:\s*([^|]+)/);
        const designMatch = text.match(/Design:\s*([^|]+)/);

        const productName = nameMatch?.[1]?.trim() || "Unknown Product";
        const mrp = Number(mrpMatch?.[1] || 0);

        const product = await prisma.productRegister.create({
          data: {
            productName,
          },
        });

        await prisma.shopStockItem.create({
          data: {
            barCode: barcode,
            productId: product.productId,
            itemName: productName,
            saleRate: mrp,
            brandName: brandMatch?.[1]?.trim(),
            design_name: designMatch?.[1]?.trim(),
            indate: new Date(),
          },
        });

        productId = product.productId;
      }
    }

    if (!productId || quantity === undefined) {
      res.status(400).json({
        success: false,
        message: "ProductId and quantity are required",
      });
      return;
    }

    const numProductId = Number(productId);
    const numQuantity = Number(quantity);

    if (isNaN(numProductId) || isNaN(numQuantity) || numQuantity < 1) {
      res.status(400).json({
        success: false,
        message: "Valid productId and quantity (min 1) are required",
      });
      return;
    }

    const result = await cartRepository.addToCart(
      comId,
      numProductId,
      numQuantity,
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: enrichCartItem(result),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Get Cart ----------------
export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let comId = req.user!.comId;

    if (!comId) {
      const customer = await prisma.customer.findUnique({
        where: { id: req.user!.id },
      });
      comId = customer?.comId;
    }

    if (!comId) {
      res.status(401).json({
        success: false,
        message: "User identity (comId) could not be verified. Please log in again.",
      });
      return;
    }


    const items = await cartRepository.getCartByComId(comId);

    let grandTotal = 0;
    const enrichedItems = items.map((item: any) => {
      const enriched = enrichCartItem(item);
      grandTotal += enriched.itemTotal;
      return enriched;
    });

    res.status(200).json({
      success: true,
      count: enrichedItems.length,
      data: {
        items: enrichedItems,
        grandTotal: Number(grandTotal.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Update Quantity ----------------
export const updateCartQuantity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let comId = req.user!.comId;

    if (!comId) {
      const customer = await prisma.customer.findUnique({
        where: { id: req.user!.id },
      });
      comId = customer?.comId;
    }

    if (!comId) {
      res.status(401).json({
        success: false,
        message: "User identity (comId) could not be verified. Please log in again.",
      });
      return;
    }


    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (isNaN(itemId)) {
      res.status(400).json({
        success: false,
        message: "Valid itemId is required",
      });
      return;
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
      res.status(400).json({
        success: false,
        message: "Valid quantity (min 1) is required",
      });
      return;
    }

    const result = await cartRepository.updateQuantity(
      comId,
      itemId,
      Number(quantity),
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: enrichCartItem(result),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Remove Item ----------------
export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let comId = req.user!.comId;

    if (!comId) {
      const customer = await prisma.customer.findUnique({
        where: { id: req.user!.id },
      });
      comId = customer?.comId;
    }

    if (!comId) {
      res.status(401).json({
        success: false,
        message: "User identity (comId) could not be verified. Please log in again.",
      });
      return;
    }


    const itemId = Number(req.params.itemId);

    if (isNaN(itemId)) {
      res.status(400).json({
        success: false,
        message: "Valid itemId is required",
      });
      return;
    }

    await cartRepository.removeCartItem(comId, itemId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Clear Cart ----------------
export const clearCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let comId = req.user!.comId;

    if (!comId) {
      const customer = await prisma.customer.findUnique({
        where: { id: req.user!.id },
      });
      comId = customer?.comId;
    }

    if (!comId) {
      res.status(401).json({
        success: false,
        message: "User identity (comId) could not be verified. Please log in again.",
      });
      return;
    }


    await cartRepository.clearCart(comId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};