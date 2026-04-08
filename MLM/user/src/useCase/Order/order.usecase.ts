import AppError from "@/errors/AppError";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
} from "../../data/repositories/Order.Repository";
import {
  getUserWallet,
  updateWalletBalance,
} from "../../data/repositories/wallet.Repository";

import { Prisma, OrderPlace } from "@prisma/client";
import prisma from "@/prisma-client";

export const createOrderService = async (data: any): Promise<any> => {
  if (!data.customerId) {
    throw AppError.badRequest("Customer id is required");
  }

  if (!data.items || data.items.length === 0) {
    throw AppError.badRequest("Order items are required");
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await getUserWallet(data.customerId, tx);

    if (!wallet) {
      throw AppError.badRequest("Wallet not found");
    }

    const productIds = data.items.map((i: any) => i.productId);

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== data.items.length) {
      throw AppError.badRequest("Some products not found");
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    let totalDp = 0;
    let totalBv = 0;
    let totalTax = 0;
    const orderItems = data.items.map((item: any) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw AppError.badRequest(`Product not found: ${item.productId}`);
      }

      const price = Number(product.mrp_amount);
      const discount = Math.round((( (product as any).mrp_amount - (product as any).dp_amount) / (product as any).mrp_amount) * 100);
    const savings = (product as any).mrp_amount - (product as any).dp_amount;

      const dp = Number(product.dp_amount);
      const quantity = item.quantity;

      const itemSubtotal = dp * quantity; // Use DP for subtotal as per frontend
      const itemDp = dp * quantity;

      subtotal += itemSubtotal;
      totalDp += itemDp;

      const bv = Math.floor(itemSubtotal / 10);
      totalBv += bv;

      return {
        productId: (product as any).id,
        productName: (product as any).productName,
        sku: (product as any).sku,
        price: price, // Keep MRP in individual item price if needed, or use DP? Let's use MRP for reference
        quantity: quantity,
        bv: bv,
        totalPrice: itemSubtotal,
      };
    });

    const config = await tx.config.findFirst();
    let shippingAmount = Number(config?.deliveryCharge || 0);
    const totalPurchaseAmount = subtotal + shippingAmount;

    if (totalPurchaseAmount < 500) {
      throw AppError.badRequest("Minimum order value is ₹500");
    }

    // Include shipping in total DP deduction if using DP Wallet
    const totalPayableDp = data.paymentMethod === "DP_WALLET" ? totalDp + shippingAmount : totalDp;

    const walletDp = Number(wallet.balance_dp_amount);

    if (walletDp < totalPayableDp) {
      throw AppError.badRequest(`Insufficient wallet DP balance. Required: ₹${totalPayableDp}, Available: ₹${walletDp}`);
    }

    const order = await tx.orderPlace.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date(),

        customerId: data.customerId,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "DP_WALLET" ? "PAID" : "PENDING",
        orderStatus: "PENDING",

        subtotal,
        shippingAmount,
        gstAmount: 0,
        coinsApplied: 0,

        totalPurchaseAmount,
        totalDpAmount: totalDp,
        totalTax: 0,
        totalBv,

        items: {
          create: orderItems,
        },

        address: data.address
          ? {
            create: data.address,
          }
          : undefined,
      },
    });

    // Deduct the total amount (including shipping) from wallet
    await updateWalletBalance(data.customerId, totalPayableDp, tx);

    // 6. Clear user cart
    await tx.cart.deleteMany({
      where: { userId: data.customerId }
    });

    // Fetch the fully populated order to return to frontend
    const finalOrder = await tx.orderPlace.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        address: true,
      },
    });

    if (!finalOrder) {
      throw AppError.internal("Failed to retrieve created order");
    }

    // Map to Frontend Expected Structure (matches Order interface in orderSlice.ts)
    return {
      id: finalOrder.orderNumber,
      date: finalOrder.orderDate.toISOString(),
      deliveryDate: new Date(finalOrder.orderDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      total: Number(finalOrder.totalDpAmount) + Number(finalOrder.shippingAmount),
      paymentMethod: finalOrder.paymentMethod,
      shippingAddress: {
        fullName: finalOrder.address?.name || "Customer",
        phone: finalOrder.address?.phone || "",
        address: finalOrder.address
          ? `${finalOrder.address.addressLine}, ${finalOrder.address.city}, ${finalOrder.address.state} - ${finalOrder.address.pincode}`
          : "Address not found",
        zipCode: finalOrder.address?.pincode || "",
        addressType: (finalOrder.address as any)?.type || "Home"
      },
      items: finalOrder.items.map(item => ({
        id: item.productId,
        name: item.productName,
        qty: item.quantity,
        price: Number(item.price)
      }))
    };
  });
};

export const getAllOrdersService = async (): Promise<OrderPlace[]> => {
  return getAllOrders();
};

export const getOrderByIdService = async (id: number): Promise<OrderPlace> => {
  if (!id) {
    throw AppError.badRequest("Order id is required");
  }

  const order = await getOrderById(id);

  if (!order) {
    throw AppError.notFound("Order not found");
  }

  return order;
};

export const getOrdersByCustomerService = async (
  customerId: number,
): Promise<OrderPlace[]> => {
  if (!customerId) {
    throw AppError.badRequest("Customer id is required");
  }

  return getOrdersByCustomer(customerId);
};

export const updateOrderService = async (
  id: number,
  data: Prisma.OrderPlaceUpdateInput,
): Promise<OrderPlace> => {
  if (!id) {
    throw AppError.badRequest("Order id is required");
  }

  const existingOrder = await getOrderById(id);

  if (!existingOrder) {
    throw AppError.notFound("Order not found");
  }

  return updateOrder(id, data);
};

export const deleteOrderService = async (id: number): Promise<OrderPlace> => {
  if (!id) {
    throw AppError.badRequest("Order id is required");
  }

  const existingOrder = await getOrderById(id);

  if (!existingOrder) {
    throw AppError.notFound("Order not found");
  }

  return deleteOrder(id);
};
