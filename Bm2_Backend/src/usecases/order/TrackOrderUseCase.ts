import { OrderRepository } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

/**
 * Track order history with items
 */
export const trackOrderUseCase = async (orderId: string) => {
  const history = await orderRepo.trackOrder(orderId);
  return history.map((h: any) => {
    let qnty = null;
    let rate = null;

    if (h.orderDetail) {
      qnty = h.orderDetail.qnty;
      rate = h.orderDetail.rate;
    } else if (h.orderMaster?.orderDetails?.[0]) {
      qnty = h.orderMaster.orderDetails[0].qnty;
      rate = h.orderMaster.orderDetails[0].rate;
    }

    return {
      order_id: h.order_id,
      status: h.order_status,
      cancel_reason: h.cancel_reason ?? null,
      created_at: h.created_at,
      productName: h.productName || "",
      productImage: h.productImage || "",
      image: h.productImage || "",
      qnty,
      rate,
    };
  });
};
