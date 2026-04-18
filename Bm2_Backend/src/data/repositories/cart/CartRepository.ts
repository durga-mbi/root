import prisma from "../../../prisma-client";

export class CartRepository {
  // ---------------- Add to Cart ----------------
  async addToCart(comId: number, productId: number, quantity: number) {
    const existing = await prisma.x5_app_cart.findUnique({
      where: {
        comId_productId: { comId, productId },
      },
    });

    const includeOptions = {
      product: {
        include: {
          images: { select: { proimgs: true }, take: 1 },
          stockItems: { where: { status: "ONE" as const }, take: 1 },
        },
      },
    };

    // If exists & active → increase quantity
    if (existing && !existing.isDeleted) {
      return prisma.x5_app_cart.update({
        where: {
          comId_productId: { comId, productId },
        },
        data: {
          quantity: existing.quantity + quantity,
        },
        include: includeOptions,
      });
    }

    // If exists but deleted → restore
    if (existing && existing.isDeleted) {
      return prisma.x5_app_cart.update({
        where: {
          comId_productId: { comId, productId },
        },
        data: {
          quantity,
          isDeleted: false,
        },
        include: includeOptions,
      });
    }

    // Create new
    return prisma.x5_app_cart.create({
      data: {
        comId,
        productId,
        quantity,
        isDeleted: false,
      },
      include: includeOptions,
    });
  }

  // ---------------- Get Cart ----------------
  async getCartByComId(comId: number) {
    return prisma.x5_app_cart.findMany({
      where: {
        comId,
        isDeleted: false,
      },
      include: {
        product: {
          include: {
            images: { select: { proimgs: true }, take: 1 },
            stockItems: { where: { status: "ONE" }, take: 1 },
          },
        },
      },
    });
  }

  // ---------------- Update Quantity ----------------
  async updateQuantity(comId: number, productId: number, quantity: number) {
    const existing = await prisma.x5_app_cart.findFirst({
      where: {
        comId,
        productId,
        isDeleted: false,
      },
    });

    if (!existing) {
      throw new Error("Cart item not found");
    }

    return prisma.x5_app_cart.update({
      where: {
        comId_productId: { comId, productId },
      },
      data: {
        quantity,
      },
      include: {
        product: {
          include: {
            images: { select: { proimgs: true }, take: 1 },
            stockItems: { where: { status: "ONE" }, take: 1 },
          },
        },
      },
    });
  }

  // ---------------- Remove Single Item ----------------
  async removeCartItem(comId: number, productId: number) {
    return prisma.x5_app_cart.update({
      where: {
        comId_productId: { comId, productId },
      },
      data: {
        isDeleted: true,
      },
    });
  }

  // ---------------- Clear Cart ----------------
  async clearCart(comId: number) {
    return prisma.x5_app_cart.updateMany({
      where: {
        comId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}