import prisma from "../../../prisma-client";

export class CartRepository {
  // ---------------- Add to Cart ----------------
  async addToCart(comId: number, ItemId: number, quantity: number) {
    // Check if item already exists (even if soft deleted)
    const existing = await prisma.x5_app_cart.findUnique({
      where: {
        comId_ItemId: { comId, ItemId },
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

    // If item exists and NOT deleted → increase quantity
    if (existing && existing.isDeleted === false) {
      return prisma.x5_app_cart.update({
        where: {
          comId_ItemId: { comId, ItemId },
        },
        data: {
          quantity: existing.quantity + quantity,
        },
        include: includeOptions,
      });
    }

    // If item exists but soft deleted → restore it and update quantity
    if (existing && existing.isDeleted === true) {
      return prisma.x5_app_cart.update({
        where: {
          comId_ItemId: { comId, ItemId },
        },
        data: {
          quantity,
          isDeleted: false,
        },
        include: includeOptions,
      });
    }

    // If item does not exist → create new
    console.log(
      `DEBUG: Creating cart item for comId=${comId}, ItemId=${ItemId}`,
    );
    return prisma.x5_app_cart.create({
      data: {
        comId,
        ItemId,
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
            images: {
              select: { proimgs: true },
              take: 1,
            },
            stockItems: {
              where: { status: "ONE" },
              take: 1,
            },
          },
        },
      },
    });
  }

  // ---------------- Update Quantity ----------------
  async updateQuantity(comId: number, ItemId: number, quantity: number) {
    const existing = await prisma.x5_app_cart.findFirst({
      where: {
        comId,
        ItemId,
        isDeleted: false,
      },
    });

    if (!existing) {
      throw new Error("Cart item not found");
    }

    return prisma.x5_app_cart.update({
      where: {
        comId_ItemId: { comId, ItemId },
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

  // ---------------- Soft Delete Single Item ----------------
  async removeCartItem(comId: number, ItemId: number) {
    return prisma.x5_app_cart.update({
      where: {
        comId_ItemId: { comId, ItemId },
      },
      data: {
        isDeleted: true,
      },
    });
  }

  // ---------------- Soft Delete All ----------------
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
