import { OrderRepository } from "../../data/repositories/order/OrderRepository";
import { formatDecimal } from "../../utils";

const orderRepo = new OrderRepository();

/**
 * Get order by ID with details and status history
 */
export const getOrderUseCase = async (orderId: string) => {
  const order = await orderRepo.getOrder(orderId);
  if (!order) return null;

  const num_items = order.orderDetails.reduce(
    (acc: number, item: any) => acc + item.qnty,
    0,
  );

  return formatDecimal({
    ...order,
    num_items,
    total_amount: order.total_amount,
    tax: order.tax_amount_b_coins,
    payment_method: order.net_amount_payment_mode,
    delivery_date: order.delivery_date,
  });
};
