import {
  OrderRepository,
  OrderInput,
} from "../../data/repositories/order/OrderRepository";

import AppError from "../../errors/AppError";
import { formatDecimal } from "../../utils";
import config from "../../config";

const orderRepo = new OrderRepository();

/**
 * Create Order UseCase
 * Handles validation + calculation + transactional creation
 */
export const createOrderUseCase = async (data: OrderInput) => {
  if (!data.items || data.items.length === 0) {
    throw AppError.badRequest("Order must contain at least one item");
  }

  let calculatedSubtotal = 0;

  //   Validate Items
  for (const item of data.items) {
    /** ---------------- PRODUCT CHECK ---------------- */
    const product = await orderRepo.getProductById(item.productId);

    if (!product) {
      throw AppError.notFound(`Product with ID ${item.productId} not found`);
    }

    /** ---------------- STOCK CHECK ---------------- */
    const stock = await orderRepo.getShopStockItem(item.productId);

    if (!stock) {
      throw AppError.notFound(
        `Stock not available for product ${item.productId}`,
      );
    }

    /** ---------------- RATE VALIDATION ---------------- */
    const expectedRate = Number(stock.saleRate ?? stock.mrpRate ?? 0);

    const isProd = config.env === "production";

    if (Math.abs(item.rate - expectedRate) > 0.01) {
      if (isProd) {
        throw AppError.badRequest(
          `Price mismatch for product ${item.productId}. Expected ${expectedRate}, got ${item.rate}`,
        );
      } else {
        console.warn(
          `[DEV] Price mismatch allowed for product ${item.productId}`,
        );
      }
    }

    /** ---------------- NET AMOUNT CHECK ---------------- */
    const expectedNetAmount = item.qnty * item.rate;

    if (Math.abs(item.net_amount - expectedNetAmount) > 0.01) {
      throw AppError.badRequest(
        `Net amount mismatch for product ${item.productId}`,
      );
    }

    calculatedSubtotal += item.net_amount;
  }

  /**
   * ===============================
   * FINAL ORDER CALCULATION
   * ===============================
   */

  const tax = Number(data.tax_amount_b_coins ?? 0);
  const delivery = Number(data.del_charge_amount ?? 0);
  const discount = Number(data.discounted_amount ?? 0);

  const expectedTotal = calculatedSubtotal + tax + delivery - discount;

  if (Math.abs(Number(data.total_amount) - expectedTotal) > 0.1) {
    throw AppError.badRequest(
      `Total mismatch. Expected ${expectedTotal}, got ${data.total_amount}`,
    );
  }

  /**
   * ===============================
   * CREATE ORDER (TRANSACTION)
   * ===============================
   */
  const order = await orderRepo.createOrder(data);

  if (!order) {
    throw AppError.internal("Order creation failed");
  }

  /**
   * ===============================
   * RESPONSE ENRICHMENT
   * ===============================
   */

  // Re-fetch full order to include details
  const fullOrder = await orderRepo.getOrder(order.order_id);

  const num_items =
    fullOrder?.orderDetails?.reduce(
      (sum: number, item: any) => sum + Number(item.qnty || 0),
      0,
    ) ?? 0;

  const enrichedOrder = {
    ...fullOrder,
    num_items,
    subtotal: calculatedSubtotal,
    total_amount: fullOrder?.total_amount,
    tax_amount: fullOrder?.tax_amount_b_coins,
    discount: fullOrder?.discounted_amount,
    payment_method: fullOrder?.net_amount_payment_mode,
  };

  return formatDecimal({
    message: "Order Created Successfully",
    order_id: order.order_id,
    order: enrichedOrder,
  });
};
