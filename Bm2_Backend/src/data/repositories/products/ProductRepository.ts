// Commented out - ShopStockItem model is not in Prisma schema (use ProductRegister instead)
/*
import prisma from "../../../prisma-client";
import { ShopStockItem, Prisma } from "@prisma/client";

// Helper to filter out invalid dates in where clause
const getValidDateFilter = (): Prisma.ShopStockItemWhereInput => ({
  OR: [
    { indate: null },
    {
      AND: [
        { indate: { not: null } },
        { indate: { not: "0000-00-00" } },
        { indate: { not: "" } },
        { indate: { not: "0000-00-00 00:00:00" } },
      ],
    },
  ],
});

// Get new arrivals - products sorted by insertDate (newest first)
// Using insertDate instead of indate to avoid invalid date issues
export const getNewArrivals = async (
  limit?: number
): Promise<ShopStockItem[]> => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  return prisma.shopStockItem.findMany({
    where: {
      status: "1",
      ...getValidDateFilter(),
    },
    orderBy: { insertDate: "desc" },
    take: queryLimit,
  });
};
*/
