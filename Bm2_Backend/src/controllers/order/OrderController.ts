import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma-client"; // ✅ IMPORTANT

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
    if (!user || user.comId === undefined) {
      res.status(401).json({
        success: false,
        msg: "Authentication required or missing comId",
      });
      return;
    }

    const orderData: any = {
      ...req.body,
      comId: user.comId,
    };

    // ====================================================
    // 🔥 HANDLE PRODUCT STRING → productId RESOLUTION
    // ====================================================
    if (orderData.items && Array.isArray(orderData.items)) {
      for (let item of orderData.items) {
        if (!item.productId && item.product) {
          const text = item.product;

          // ✅ Extract barcode
          const barcodeMatch = text.match(/Barcode:\s*(\d+)/);
          if (!barcodeMatch) {
            res.status(400).json({
              success: false,
              msg: "Invalid product format",
            });
            return;
          }

          const barcode = barcodeMatch[1];

          // ✅ Check if stock already exists
          let stock = await prisma.shopStockItem.findFirst({
            where: { barCode: barcode },
          });

          if (stock && stock.productId) {
            // ✅ Existing product
            item.productId = stock.productId;
          } else {
            // ✅ Parse remaining details
            const nameMatch = text.match(/^(.+?)\s*\(/);
            const mrpMatch = text.match(/MRP:\s*(\d+)/);
            const brandMatch = text.match(/Brand:\s*([^|]+)/);
            const designMatch = text.match(/Design:\s*([^|]+)/);

            const productName = nameMatch?.[1]?.trim() || "Unknown Product";
            const mrp = Number(mrpMatch?.[1] || 0);
            const brand = brandMatch?.[1]?.trim() || null;
            const design = designMatch?.[1]?.trim() || null;

            // ✅ Create ProductRegister
            const product = await prisma.productRegister.create({
              data: {
                productName: productName,
              },
            });

            // ✅ Create ShopStockItem
            await prisma.shopStockItem.create({
              data: {
                barCode: barcode,
                productId: product.productId,
                itemName: productName,
                saleRate: mrp,
                brandName: brand,
                design_name: design,
                indate: new Date(),
              },
            });

            item.productId = product.productId;
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

    if (!user || user.comId === undefined) {
      res.status(401).json({
        success: false,
        msg: "Authentication required or missing comId",
      });
      return;
    }

    const { page, limit, status } = req.query;

    const result = await getAllOrdersUseCase({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string | undefined,
      comId: user.comId,
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