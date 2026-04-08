import { Prisma, caa1_shop_stock_item_db_status } from "@prisma/client";
import prisma from "../../../prisma-client";
import { getProductMainImage } from "../../../utils/product-image";
import { WalletService } from "@/services/WalletService";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderItemInput {
  productId: number;
  qnty: number;
  rate: number;
  net_amount: number;
}

export interface OrderInput {
  comId: number;
  items: OrderItemInput[];
  total_amount: number;
  discounted_amount?: number;
  del_charge_amount?: number;
  tax_amount_b_coins?: number;
  payment_mode: string;
  delivery_date?: string;
  coinsToRedeem?: number;
}

export class OrderRepository {
  /**
   * Helper to add productName and productImage to order items
   */
  private enrichOrder(order: any) {
    if (!order) return null;

    // 1. Flatten items inside orderDetails
    if (order.orderDetails && Array.isArray(order.orderDetails)) {
      order.orderDetails = order.orderDetails.map((item: any) => {
        const mainImg = getProductMainImage(item.product) || "";

        return {
          ...item,
          productName: item.product?.productName || "",
          productImage: mainImg,
          // For backup compatibility
          image: mainImg,
        };
      });

      // 2. Pull the FIRST item's details to the top level of the Order object
      // This is what the "My Orders" list view usually expects.
      if (order.orderDetails.length > 0) {
        const first = order.orderDetails[0];
        order.productName = order.productName || first.productName;
        order.productImage = order.productImage || first.productImage;
        order.image = order.image || first.productImage;
      }
    }
    return order;
  }

  /**
   * Create a new order — uses our BM00X order ID format
   */
  async createOrder(data: OrderInput) {
    // Get next sequential ID to generate BM00X format
    const lastOrder = await prisma.x8_app_orders_master.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });

    const nextId = (lastOrder?.id || 0) + 1;
    const orderId = `BM00${nextId}`;

    return await prisma.$transaction(async (tx: any) => {
      let finalDiscount = data.discounted_amount || 0;

      // --- WALLET REDEMPTION ---
      // if (data.coinsToRedeem && data.coinsToRedeem > 0) {
      //   const { WalletService } = require("../../../services/WalletService");
      //   const walletService = new WalletService();
      //   const redeemed = await walletService.redeemCoins(
      //     data.comId,
      //     orderId,
      //     data.coinsToRedeem,
      //     data.total_amount,
      //     tx,
      //   );
      //   finalDiscount += redeemed;
      // }

      // --- WALLET REDEMPTION ---
      if (data.coinsToRedeem && data.coinsToRedeem > 0) {
        const walletService = new WalletService();

        const redeemed = await walletService.redeemCoins(
          data.comId,
          orderId,
          data.coinsToRedeem,
          data.total_amount,
          tx,
        );

        finalDiscount += redeemed;
      }

      // 1. Create Order Master
      const order = await tx.x8_app_orders_master.create({
        data: {
          order_id: orderId,
          comId: data.comId,
          total_amount: new Prisma.Decimal(data.total_amount),
          discounted_amount: new Prisma.Decimal(finalDiscount),
          del_charge_amount: data.del_charge_amount
            ? new Prisma.Decimal(data.del_charge_amount)
            : new Prisma.Decimal(0),
          tax_amount_b_coins: data.tax_amount_b_coins
            ? new Prisma.Decimal(data.tax_amount_b_coins)
            : new Prisma.Decimal(0),
          net_amount_payment_mode: data.payment_mode,
          status: OrderStatus.PENDING,
        },
        include: {
          orderDetails: {
            include: {
              product: {
                select: {
                  productName: true,
                  proimg: true,
                  images: { select: { proimgs: true }, take: 1 },
                },
              },
            },
          },
        },
      });

      // 2. Create Order Details
      await tx.x9_app_order_details.createMany({
        data: data.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId,
          qnty: item.qnty,
          rate: new Prisma.Decimal(item.rate),
          net_amount: new Prisma.Decimal(item.net_amount),
          comId: data.comId,
        })),
      });

      // 3. Create Initial Status (Raw SQL for robustness on teammate laptops)
      await tx.$executeRaw`
        INSERT INTO x10_app_order_status
          (order_id, order_status, com_id)
        VALUES
          (${orderId}, ${OrderStatus.PENDING}, ${data.comId ?? null})
      `;

      // We re-fetch to ensure the orderDetails we created above are included with product info
      const finalOrder = await tx.x8_app_orders_master.findUnique({
        where: { order_id: orderId },
        include: {
          orderDetails: {
            include: {
              product: {
                select: {
                  productName: true,
                  proimg: true,
                  images: { select: { proimgs: true }, take: 1 },
                },
              },
            },
          },
        },
      });

      // 4. Clear user's cart after successful order placement
      await tx.x5_app_cart.updateMany({
        where: {
          comId: data.comId,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      });

      return this.enrichOrder(finalOrder);
    });
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: number) {
    return (prisma as any).productRegister.findUnique({
      where: { productId: productId },
    });
  }

  /**
   * Get shop stock item by product ID
   */
  async getShopStockItem(productId: number) {
    return (prisma as any).shopStockItem.findFirst({
      where: { itemId: productId, status: caa1_shop_stock_item_db_status.ONE },
    });
  }

  /**
   * Update order status and return the new status entry
   */
  async updateStatusByOrderId(
    orderId: string,
    status: OrderStatus,
    updated_by?: number,
  ) {
    return this.updateStatusWithDetails(orderId, status, { updated_by });
  }

  /**
   * Update order status with additional cancellation details
   * Uses raw SQL to ensure cancel_reason is written regardless of client version
   */
  async updateStatusWithDetails(
    orderId: string,
    status: OrderStatus,
    details: {
      updated_by?: number;
      cancel_reason?: string;
      cancelled_by_type?: string;
    },
  ) {
    // Insert via raw SQL so cancel_reason and snapshot columns are always written correctly
    await prisma.$executeRaw`
      INSERT INTO x10_app_order_status
        (order_id, order_status, cancel_reason, updated_by, total_amount, discounted_amount, del_charge_amount, tax_amount_b_coins, net_amount_payment_mode, quantity)
      VALUES
        (${orderId}, ${status}, ${details.cancel_reason ?? null}, ${details.updated_by ?? null},
         ${(details as any).total_amount ?? null}, ${(details as any).discounted_amount ?? null},
         ${(details as any).del_charge_amount ?? null}, ${(details as any).tax_amount_b_coins ?? null},
         ${(details as any).net_amount_payment_mode ?? null}, ${(details as any).quantity ?? null})
    `;

    // Also update the master record status for consistency
    await (prisma as any).x8_app_orders_master.update({
      where: { order_id: orderId },
      data: { status },
    });

    // Return the newly inserted row, enhanced with order master and flattened names/images
    const row = await (prisma as any).x10_app_order_status.findFirst({
      where: { order_id: orderId },
      orderBy: { id: "desc" },
      include: {
        orderMaster: {
          include: {
            orderDetails: {
              include: {
                product: {
                  select: {
                    productName: true,
                    proimg: true,
                    images: { select: { proimgs: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (row && row.orderMaster) {
      row.orderMaster = this.enrichOrder(row.orderMaster);
    }
    return row;
  }

  /**
   * Cancel order wrapper
   */
  async cancelOrder(
    orderId: string,
    details: {
      updated_by?: number;
      cancel_reason?: string;
      cancelled_by_type?: string;
    },
  ) {
    return this.updateStatusWithDetails(
      orderId,
      OrderStatus.CANCELLED,
      details,
    );
  }

  /**
   * Get main order by ID with details and status history
   */
  async getOrder(orderId: string) {
    const order = await (prisma as any).x8_app_orders_master.findUnique({
      where: { order_id: orderId },
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                productName: true,
                proimg: true,
                images: { select: { proimgs: true }, take: 1 },
              },
            },
          },
        },
        orderStatus: {
          orderBy: { id: "desc" },
        },
      },
    });
    return this.enrichOrder(order);
  }

  /**
   * Get all orders with optional pagination and filters
   */
  async getAllOrders(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      comId?: number;
    } = {},
  ) {
    const { page = 1, limit = 10, status, comId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (comId !== undefined) where.comId = comId;
    if (status) {
      where.orderStatus = { some: { order_status: status } };
    }

    const totalOrders = await (prisma as any).x8_app_orders_master.count({
      where,
    });

    const orders = await (prisma as any).x8_app_orders_master.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                productName: true,
                proimg: true,
                images: { select: { proimgs: true }, take: 1 },
              },
            },
          },
        },
        orderStatus: {
          orderBy: { id: "desc" },
          take: 1,
        },
      },
    });

    return {
      data: orders.map((o: any) => this.enrichOrder(o)),
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    };
  }

  /**
   * Track order history with items (enhanced)
   */
  async trackOrder(orderId: string) {
    const history = await (prisma as any).x10_app_order_status.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: "asc" },
      include: {
        orderDetail: {
          include: {
            product: {
              select: {
                productName: true,
                proimg: true,
                images: { select: { proimgs: true }, take: 1 },
              },
            },
          },
        },
        orderMaster: {
          include: {
            orderDetails: {
              include: {
                product: {
                  select: {
                    productName: true,
                    proimg: true,
                    images: { select: { proimgs: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
      },
    });

    return history.map((item: any) => {
      // Basic enriched item with original fields + order_id
      const enrichedItem = {
        ...item,
        order_id: item.order_id || orderId,
      };

      // Find the best possible name/image for this row
      let pName = "";
      let pImg = "";

      if (item.orderDetail?.product) {
        const p = item.orderDetail.product;
        pName = p.productName || "";
        pImg = getProductMainImage(p) || "";
      } else if (item.orderMaster?.orderDetails?.[0]?.product) {
        const p = item.orderMaster.orderDetails[0].product;
        pName = p.productName || "";
        pImg = getProductMainImage(p) || "";
      }

      // Add to top level
      enrichedItem.productName = pName;
      enrichedItem.productImage = pImg;
      enrichedItem.image = pImg;

      // Also enrich the nested objects for safety
      if (item.orderDetail) {
        enrichedItem.orderDetail = {
          ...item.orderDetail,
          productName: pName,
          productImage: pImg,
          image: pImg,
        };
      }
      if (item.orderMaster) {
        enrichedItem.orderMaster = this.enrichOrder(item.orderMaster);
      }

      return enrichedItem;
    });
  }
}
// import { Prisma, caa1_shop_stock_item_db_status } from "@prisma/client";
// import prisma from "../../../prisma-client";
// import { getProductMainImage } from "../../../utils/product-image";
// import { WalletService } from "../../../services/WalletService";

// export enum OrderStatus {
//   PENDING = "PENDING",
//   CONFIRMED = "CONFIRMED",
//   SHIPPED = "SHIPPED",
//   DELIVERED = "DELIVERED",
//   CANCELLED = "CANCELLED",
// }

// export interface OrderItemInput {
//   productId: number;
//   qnty: number;
//   rate: number;
//   net_amount: number;
// }

// export interface OrderInput {
//   comId: number;
//   items: OrderItemInput[];
//   total_amount: number;
//   discounted_amount?: number;
//   del_charge_amount?: number;
//   tax_amount_b_coins?: number;
//   payment_mode: string;
//   delivery_date?: string;
//   coinsToRedeem?: number;
// }

// export class OrderRepository {
//   private enrichOrder(order: any) {
//     if (!order) return null;

//     if (order.orderDetails && Array.isArray(order.orderDetails)) {
//       order.orderDetails = order.orderDetails.map((item: any) => {
//         const mainImg = getProductMainImage(item.product) || "";
//         return {
//           ...item,
//           productName: item.product?.productName || "",
//           productImage: mainImg,
//           image: mainImg,
//         };
//       });

//       if (order.orderDetails.length > 0) {
//         const first = order.orderDetails[0];
//         order.productName = order.productName || first.productName;
//         order.productImage = order.productImage || first.productImage;
//         order.image = order.image || first.productImage;
//       }
//     }

//     return order;
//   }

//   async createOrder(data: OrderInput) {
//     const lastOrder = await prisma.x8_app_orders_master.findFirst({
//       orderBy: { id: "desc" },
//       select: { id: true },
//     });

//     const nextId = (lastOrder?.id || 0) + 1;
//     const orderId = `BM00${nextId}`;

//     return await prisma.$transaction(async (tx: any) => {
//       let finalDiscount = data.discounted_amount || 0;

//       // ✅ Wallet redemption using ES import
//       if (data.coinsToRedeem && data.coinsToRedeem > 0) {
//         const walletService = new WalletService();
//         const redeemed = await walletService.redeemCoins(
//           data.comId,
//           orderId,
//           data.coinsToRedeem,
//           data.total_amount,
//           tx,
//         );
//         finalDiscount += redeemed;
//       }

//       const order = await tx.x8_app_orders_master.create({
//         data: {
//           order_id: orderId,
//           comId: data.comId,
//           total_amount: new Prisma.Decimal(data.total_amount),
//           discounted_amount: new Prisma.Decimal(finalDiscount),
//           del_charge_amount: data.del_charge_amount
//             ? new Prisma.Decimal(data.del_charge_amount)
//             : new Prisma.Decimal(0),
//           tax_amount_b_coins: data.tax_amount_b_coins
//             ? new Prisma.Decimal(data.tax_amount_b_coins)
//             : new Prisma.Decimal(0),
//           net_amount_payment_mode: data.payment_mode,
//           status: OrderStatus.PENDING,
//         },
//         include: {
//           orderDetails: {
//             include: {
//               product: {
//                 select: {
//                   productName: true,
//                   proimg: true,
//                   images: { select: { proimgs: true }, take: 1 },
//                 },
//               },
//             },
//           },
//         },
//       });

//       await tx.x9_app_order_details.createMany({
//         data: data.items.map((item) => ({
//           order_id: orderId,
//           product_id: item.productId,
//           qnty: item.qnty,
//           rate: new Prisma.Decimal(item.rate),
//           net_amount: new Prisma.Decimal(item.net_amount),
//           comId: data.comId,
//         })),
//       });

//       await tx.$executeRaw`
//         INSERT INTO x10_app_order_status
//           (order_id, order_status, com_id)
//         VALUES
//           (${orderId}, ${OrderStatus.PENDING}, ${data.comId ?? null})
//       `;

//       const finalOrder = await tx.x8_app_orders_master.findUnique({
//         where: { order_id: orderId },
//         include: {
//           orderDetails: {
//             include: {
//               product: {
//                 select: {
//                   productName: true,
//                   proimg: true,
//                   images: { select: { proimgs: true }, take: 1 },
//                 },
//               },
//             },
//           },
//         },
//       });

//       await tx.x5_app_cart.updateMany({
//         where: { comId: data.comId, isDeleted: false },
//         data: { isDeleted: true },
//       });

//       return this.enrichOrder(finalOrder);
//     });
//   }

//   // The rest of the methods can stay the same — no more `require()` usage
// }
