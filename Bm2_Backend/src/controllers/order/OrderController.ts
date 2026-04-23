import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma-client";  

import { createOrderUseCase } from "../../usecases/order/CreateOrderUseCase";
import { cancelOrderUseCase } from "../../usecases/order/CancelOrderUseCase";
import { getOrderUseCase } from "../../usecases/order/GetOrderUseCase";
import { getAllOrdersUseCase } from "../../usecases/order/GetAllOrderUseCase";
import { trackOrderUseCase } from "../../usecases/order/TrackOrderUseCase";
import { updateOrderStatusUseCase } from "../../usecases/order/UpdateStatusUseCase";
import { OrderStatus } from "../../data/repositories/order/OrderRepository";

// ==========================================
// CREATE ORDER
// ==========================================
export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = (req as any).user;
    let comId = user?.comId || 1; // Default to 1 for testing if not logged in

    const orderData: any = {
      ...req.body,
      comId: comId,
    };

    // ====================================================
    // 🔥 HANDLE PRODUCT STRING → productId RESOLUTION
    // ====================================================
    if (orderData.items && Array.isArray(orderData.items)) {
      for (let item of orderData.items) {
        if (!item.productId && item.product) {
          const text = item.product;

          //   Extract barcode
          const barcodeMatch = text.match(/Barcode:\s*(\d+)/);
          if (!barcodeMatch) {
            res.status(400).json({
              success: false,
              msg: "Invalid product format",
            });
            return;
          }

          const barcode = barcodeMatch[1];

          //  Check if stock already exists
          const stock = await prisma.shopStockItem.findFirst({
            where: { barCode: barcode },
            select: { productId: true }, // Avoid invalid indate values
          });

          if (stock && stock.productId) {
            //  Existing product
            item.productId = stock.productId;
          } else {
            //   Parse remaining details
            const nameMatch = text.match(/^(.+?)\s*\(/);
            const mrpMatch = text.match(/MRP:\s*(\d+)/);
            const priceMatch = text.match(/Price:\s*(\d+)/);
            const brandMatch = text.match(/Brand:\s*([^|]+)/);
            const designMatch = text.match(/Design:\s*([^|]+)/);

            const productName = nameMatch?.[1]?.trim() || "Unknown Product";
            const mrp = Number(mrpMatch?.[1] || 0);
            const price = Number(priceMatch?.[1] || mrp);
            const brand = brandMatch?.[1]?.trim() || null;
            const design = designMatch?.[1]?.trim() || null;

            const tempProductId = Math.floor(Date.now() / 1000);

            //   Create ProductRegister
            const product = await prisma.productRegister.create({
              data: {
                productName: productName,
                productId: tempProductId,
              },
            });

            // Create ShopStockItem
            await prisma.shopStockItem.create({
              data: {
                barCode: barcode,
                productId: tempProductId,
                itemName: productName,
                saleRate: price,
                mrpRate: mrp.toString(),
                brandName: brandMatch?.[1]?.trim(),
                design_name: designMatch?.[1]?.trim(),
                indate: new Date(),
                status: "ONE",
              },
            });

            item.productId = tempProductId;
          }
        }
      }
    }

    // ====================================================
    // 🔥 NOW CALL USECASE (CLEAN DATA)
    // ====================================================
    const result = await createOrderUseCase(orderData);

    res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Error creating order:", err.message);
    next(err);
  }
};

// ==========================================
// CANCEL ORDER
// ==========================================
export const cancelOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { updated_by, cancel_reason, cancelled_by_type } = req.body;
    const result = await cancelOrderUseCase(orderId, {
      updated_by: updated_by ? Number(updated_by) : undefined,
      cancel_reason,
      cancelled_by_type,
    });
    res.status(200).json({
      success: true,
      msg: "Order cancelled successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Error cancelling order:", err.message);
    next(err);
  }
};

// ==========================================
// GET ORDER
// ==========================================
export const getOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await getOrderUseCase(orderId);
    if (!order) {
      res.status(404).json({ success: false, msg: "Order not found" });
      return;
    }
    res.status(200).json({
      success: true,
      msg: "Order fetched successfully",
      data: order,
    });
  } catch (err: any) {
    console.error("Error fetching order:", err.message);
    next(err);
  }
};

// ==========================================
// GET ALL ORDERS
// ==========================================
export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = (req as any).user;
    const comId = user?.comId || 1; // Default to 1 for testing

    const { page, limit, status } = req.query;

    const result = await getAllOrdersUseCase({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string | undefined,
      comId: comId,
    });

    res.status(200).json({
      success: true,
      msg: "Orders fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err: any) {
    console.error("Error fetching orders:", err.message);
    next(err);
  }
};

// ==========================================
// TRACK ORDER
// ==========================================
export const trackOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const history = await trackOrderUseCase(orderId);
    res.status(200).json({
      success: true,
      msg: "Order tracking history fetched",
      data: history,
    });
  } catch (err: any) {
    console.error("Error tracking order:", err.message);
    next(err);
  }
};

// ==========================================
// UPDATE STATUS
// ==========================================
export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status, updated_by, ...rest } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ success: false, msg: "Invalid order status" });
      return;
    }

    const result = await updateOrderStatusUseCase(
      orderId,
      status as OrderStatus,
      updated_by,
      rest,
    );
    res.status(200).json({
      success: true,
      msg: "Order status updated successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Error updating order status:", err.message);
    next(err);
  }
};