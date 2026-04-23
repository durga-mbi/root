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
    });
  }

  // ---------------- Get Cart ----------------
  async getCartByComId(comId: number) {
    const cartItems = await prisma.x5_app_cart.findMany({
      where: {
        comId,
        isDeleted: false,
      },
    });

    // Fetch products separately to avoid "required field" crashes on broken data
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.getProductWithStock(item.productId);
        return { ...item, product };
      }),
    );

    return enrichedItems;
  }

  private async getProductWithStock(productId: number) {
    // 1. Try finding by internal ID first (convention in this repo)
    let product = await prisma.productRegister.findUnique({
      where: { id: productId },
      include: {
        images: { select: { proimgs: true }, take: 1 },
        stockItems: {
          orderBy: { id: "desc" },
          take: 1,
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            saleRate: true,
            onlineRate: true,
            mrpRate: true,
            curQty: true,
            catName: true,
            gstper: true,
            pur_rate: true,
          },
        },
      },
    });

    // 2. If not found by ID, try finding by business productId
    if (!product) {
      product = await prisma.productRegister.findUnique({
        where: { productId },
        include: {
          images: { select: { proimgs: true }, take: 1 },
          stockItems: {
            orderBy: { id: "desc" },
            take: 1,
            select: {
              id: true,
              shopId: true,
              productId: true,
              categoryId: true,
              itemName: true,
              itemCode: true,
              barCode: true,
              saleRate: true,
              onlineRate: true,
              mrpRate: true,
              curQty: true,
              catName: true,
              gstper: true,
              pur_rate: true,
            },
          },
        },
      });
    }

    // 3. Fallback: If product still missing or has no stock items, try matching stock directly
    if (!product || !product.stockItems || product.stockItems.length === 0) {
      const fallbackStock = await prisma.shopStockItem.findFirst({
        where: {
          OR: [
            { productId: productId },
            ...(product?.productName ? [{ itemName: product.productName }] : []),
          ],
        },
        orderBy: { id: "desc" },
        select: {
          id: true,
          shopId: true,
          productId: true,
          categoryId: true,
          itemName: true,
          itemCode: true,
          barCode: true,
          saleRate: true,
          onlineRate: true,
          mrpRate: true,
          curQty: true,
          catName: true,
          gstper: true,
          pur_rate: true,
        },
      });

      if (fallbackStock) {
        if (!product) {
          product = {
            id: productId,
            productId: productId,
            productName: fallbackStock.itemName,
            images: [],
            stockItems: [fallbackStock],
          } as any;
        } else {
          product.stockItems = [fallbackStock];
        }
      }
    }
    return product;
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

    const updated = await prisma.x5_app_cart.update({
      where: {
        comId_productId: { comId, productId },
      },
      data: {
        quantity,
      },
    });

    // Fetch product separately using helper
    const product = await this.getProductWithStock(productId);

    return { ...updated, product };
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