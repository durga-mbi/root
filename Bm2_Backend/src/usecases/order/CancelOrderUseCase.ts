import {
  OrderRepository,
  OrderStatus,
} from "../../data/repositories/order/OrderRepository";
import AppError from "../../errors/AppError";
import { formatDecimal } from "../../utils";

const orderRepo = new OrderRepository();

/**
 * Handle order cancellation business logic
 */
export const cancelOrderUseCase = async (
  orderId: string,
  details: {
    updated_by?: number;
    cancel_reason?: string;
    cancelled_by_type?: string;
  },
) => {
  // 1. Fetch order to verify existence and state
  const order = await orderRepo.getOrder(orderId);
  if (!order) {
    throw AppError.notFound(`Order with ID ${orderId} not found`);
  }

  // Get current status (latest entry — orderStatus is ordered desc)
  const currentStatus = order.orderStatus[0]?.order_status;

  if (currentStatus === OrderStatus.CANCELLED) {
    throw AppError.badRequest("Order is already cancelled");
  }

  if (currentStatus === OrderStatus.DELIVERED) {
    throw AppError.badRequest("Cannot cancel a delivered order");
  }

  // 2. Perform cancellation
  const result = await orderRepo.cancelOrder(orderId, details);

  // Re-fetch full order for consistent response
  const updatedOrder = await orderRepo.getOrder(orderId);
  const num_items =
    updatedOrder?.orderDetails.reduce(
      (sum: number, item: any) => sum + item.qnty,
      0,
    ) || 0;

  return formatDecimal({
    ...updatedOrder,
    num_items,
    status: result.order_status,
    cancel_reason: result.cancel_reason,
    total_amount: updatedOrder?.total_amount,
    tax: updatedOrder?.tax_amount_b_coins,
    payment_method: updatedOrder?.net_amount_payment_mode,
  });
};
