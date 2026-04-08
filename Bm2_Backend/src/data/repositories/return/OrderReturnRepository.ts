import prisma from "../../../prisma-client";
import { getProductMainImage } from "../../../utils/product-image";

export class OrderReturnRepository {
  private async getProductMetaByIds(productIds: number[]) {
    const uniqueIds = Array.from(
      new Set(productIds.filter((id) => Number.isFinite(id))),
    );
    if (uniqueIds.length === 0) {
      return new Map<number, { productName: string; productImage: string }>();
    }

    const products = await prisma.productRegister.findMany({
      where: {
        productId: {
          in: uniqueIds,
        },
      },
      select: {
        productId: true,
        productName: true,
        proimg: true,
        images: {
          select: { proimgs: true },
          take: 1,
        },
      },
    });

    const productMap = new Map<
      number,
      { productName: string; productImage: string }
    >();
    for (const product of products) {
      if (!product.productId) {
        continue;
      }

      productMap.set(product.productId, {
        productName: product.productName || "",
        productImage: getProductMainImage(product) || "",
      });
    }

    return productMap;
  }

  private async enrichReturnItem<T extends { productId?: number }>(item: T) {
    const productMap = await this.getProductMetaByIds([item.productId || 0]);
    const meta = productMap.get(item.productId || 0);

    return {
      ...item,
      productName: meta?.productName || "",
      productImage: meta?.productImage || "",
      image: meta?.productImage || "",
    };
  }

  private async enrichReturnList<T extends { productId?: number }>(items: T[]) {
    const productMap = await this.getProductMetaByIds(
      items.map((item) => item.productId || 0),
    );

    return items.map((item) => {
      const meta = productMap.get(item.productId || 0);
      return {
        ...item,
        productName: meta?.productName || "",
        productImage: meta?.productImage || "",
        image: meta?.productImage || "",
      };
    });
  }

  // Create a new return request
  async createReturn(data: {
    orderId: string;
    productId: number;
    comId: number;
    returnReason: string;
    pickupDate: string | Date;
    refundAmount: number;
  }) {
    // Convert pickupDate to Date object if it's a string
    const pickupDateObj =
      typeof data.pickupDate === "string"
        ? new Date(data.pickupDate)
        : data.pickupDate;

    const created = await prisma.orderReturn.create({
      data: {
        orderId: data.orderId,
        productId: data.productId,
        comId: data.comId, // Required field
        returnReason: data.returnReason,
        pickupDate: pickupDateObj,
        refundAmount: data.refundAmount,
        status: "PENDING",
      },
    });

    return this.enrichReturnItem(created);
  }

  // Get all return requests, newest first
  async getAllReturns() {
    const returns = await prisma.orderReturn.findMany({
      orderBy: { createdAt: "desc" }, // Use model field, NOT DB column
    });

    return this.enrichReturnList(returns);
  }

  // Get a return request by ID
  async getReturnById(returnId: number) {
    const result = await prisma.orderReturn.findUnique({
      where: { id: returnId },
    });

    if (!result) {
      throw new Error(`Return with id ${returnId} not found`);
    }

    return this.enrichReturnItem(result);
  }

  // Update return request status
  async updateReturnStatus(returnId: number, status: string) {
    const existing = await prisma.orderReturn.findUnique({
      where: { id: returnId },
    });

    if (!existing) throw new Error(`Return with id ${returnId} not found`);

    const updated = await prisma.orderReturn.update({
      where: { id: returnId },
      data: { status },
    });

    return this.enrichReturnItem(updated);
  }

  // User cancels return request
  async cancelReturn(returnId: number) {
    const existing = await prisma.orderReturn.findUnique({
      where: { id: returnId },
    });

    if (!existing) {
      throw new Error(`Return with id ${returnId} not found`);
    }

    if (existing.status !== "PENDING") {
      throw new Error(
        "Return request cannot be cancelled after approval or rejection",
      );
    }

    const updated = await prisma.orderReturn.update({
      where: { id: returnId },
      data: { status: "CANCELLED" },
    });

    return this.enrichReturnItem(updated);
  }
}
