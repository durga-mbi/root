import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate-user";
import { CartRepository } from "../../data/repositories/cart/CartRepository";
import prisma from "../../prisma-client";
import { getProductMainImage } from "../../utils/product-image";

const cartRepository = new CartRepository();

// ---------------- Helper ----------------
const enrichCartItem = (item: any) => {
  const stock = item.product?.stockItems?.[0];
  const onlineRate = stock?.onlineRate ?? 0;
  const saleRate = stock?.saleRate ?? 0;
  
  // Use onlineRate for both price and mrp as requested
  const price = onlineRate || saleRate || 0;
  const mrp = onlineRate || (stock?.mrpRate ? parseFloat(stock.mrpRate) : saleRate || 0);

  const itemTotal = (price || 0) * (item.quantity || 0);
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
    mrp: mrp,
    onlinePrice: onlineRate,
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
    // Default to comId 1 if not logged in (for testing)
    const user = req.user;
    let comId = user?.comId || 1; 

    // We no longer block if user is missing for now as requested
    if (!comId) comId = 1;

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

      const stock = await prisma.shopStockItem.findFirst({
        where: { barCode: barcode },
        select: { productId: true }, // Avoid invalid indate values
      });

      if (stock && stock.productId) {
        productId = stock.productId;
      } else {
        const nameMatch = text.match(/^(.+?)\s*\(/);
        const mrpMatch = text.match(/MRP:\s*(\d+)/);
        const priceMatch = text.match(/Price:\s*(\d+)/);
        const brandMatch = text.match(/Brand:\s*([^|]+)/);
        const designMatch = text.match(/Design:\s*([^|]+)/);

        const productName = nameMatch?.[1]?.trim() || "Unknown Product";
        const mrp = Number(mrpMatch?.[1] || 0);
        const price = Number(priceMatch?.[1] || mrp); // Default to MRP if Price not found

        const tempProductId = Math.floor(Date.now() / 1000);

        // ✅ Create ProductRegister
        await prisma.productRegister.create({
          data: {
            productName: productName,
            productId: tempProductId,
          },
        });

        // ✅ Create ShopStockItem
        await prisma.shopStockItem.create({
          data: {
            barCode: barcode,
            productId: tempProductId,
            itemName: productName,
            saleRate: price,
            onlineRate: price,
            mrpRate: mrp.toString(),
            brandName: brandMatch?.[1]?.trim(),
            design_name: designMatch?.[1]?.trim(),
            indate: new Date(),
            status: "ONE",
          },
        });

        productId = tempProductId;
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

    // Fetch the full enriched item separately to avoid the previous crash
    const cartItems = await cartRepository.getCartByComId(comId);
    const addedItem = cartItems.find((i: any) => Number(i.productId) === Number(numProductId));

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: enrichCartItem(addedItem || result),
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
    const user = req.user;
    const comId = user?.comId || 1; 

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
    const user = req.user;
    const comId = user?.comId || 1;

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
    const user = req.user;
    const comId = user?.comId || 1;

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
    const user = req.user;
    const comId = user?.comId || 1;

    await cartRepository.clearCart(comId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};