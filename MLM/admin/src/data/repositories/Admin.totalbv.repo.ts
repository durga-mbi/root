import prisma from "@/prisma-client";
import { BVLedger } from "@prisma/client";

// Total Left/Right BV (Filtered for Income Generation)
export const getUserTotalBVRepo = async (userId: number) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Get all unprocessed FIRST_PURCHASE BV (these carry forward indefinitely until matched)
  const firstPurchaseRows = await prisma.bVLedger.findMany({
    where: {
      user_id: userId,
      is_income_generated: "NO",
      purchase_type: "FIRST_PURCHASE",
    },
    select: { buyer_leg: true, bv: true },
  });

  // 2. Get unprocessed REPURCHASE BV for the CURRENT MONTH ONLY
  // (Repurchase BV cleared from active calculation after month ends per requirements)
  const repurchaseRows = await prisma.bVLedger.findMany({
    where: {
      user_id: userId,
      is_income_generated: "NO",
      purchase_type: "REPURCHASE",
      createdAt: { gte: startOfThisMonth },
    },
    select: { buyer_leg: true, bv: true },
  });

  const rows = [...firstPurchaseRows, ...repurchaseRows];

  let leftBV = 0;
  let rightBV = 0;

  for (const r of rows) {
    if (r.buyer_leg === "LEFT") leftBV += Number(r.bv);
    if (r.buyer_leg === "RIGHT") rightBV += Number(r.bv);
  }

  return { leftBV, rightBV };
};

// Last Month Team BV
export const getLastMonthTeamBVRepo = async (userId: number) => {
  const startLastMonth = new Date();
  startLastMonth.setMonth(startLastMonth.getMonth() - 1);
  startLastMonth.setDate(1);
  startLastMonth.setHours(0, 0, 0, 0);

  const startThisMonth = new Date();
  startThisMonth.setDate(1);
  startThisMonth.setHours(0, 0, 0, 0);

  const result = await prisma.bVLedger.groupBy({
    by: ["buyer_leg"],
    where: {
      user_id: userId,
      buyer_leg: { in: ["LEFT", "RIGHT"] },
      createdAt: {
        gte: startLastMonth,
        lt: startThisMonth,
      },
    },
    _sum: { bv: true },
  });

  const left = result.find((r: any) => r.buyer_leg === "LEFT");
  const right = result.find((r: any) => r.buyer_leg === "RIGHT");

  return {
    lastMonthLeftBV: Number(left?._sum?.bv ?? 0),
    lastMonthRightBV: Number(right?._sum?.bv ?? 0),
  };
};

// Repurchase BV
export const getTotalRepurchaseBVRepo = async (userId: number) => {
  const result = await prisma.bVLedger.groupBy({
    by: ["buyer_leg"],
    where: {
      user_id: userId,
      buyer_leg: { in: ["LEFT", "RIGHT"] },
      purchase: {
        purchase_type: "REPURCHASE",
      },
    },
    _sum: { bv: true },
  });

  const left = result.find((r: any) => r.buyer_leg === "LEFT");
  const right = result.find((r: any) => r.buyer_leg === "RIGHT");

  return {
    totalRepurchaseLeftBV: Number(left?._sum?.bv ?? 0),
    totalRepurchaseRightBV: Number(right?._sum?.bv ?? 0),
  };
};

// First Purchase BV
export const totalFirstPurchaseRepo = async (userId: number) => {
  const result = await prisma.bVLedger.groupBy({
    by: ["buyer_leg"],
    where: {
      user_id: userId,
      buyer_leg: { in: ["LEFT", "RIGHT"] },
      purchase: {
        purchase_type: "FIRST_PURCHASE",
      },
    },
    _sum: { bv: true },
  });

  const left = result.find((r: any) => r.buyer_leg === "LEFT");
  const right = result.find((r: any) => r.buyer_leg === "RIGHT");

  return {
    totalFirstPurchaseLeftBV: Number(left?._sum?.bv ?? 0),
    totalFirstPurchaseRightBV: Number(right?._sum?.bv ?? 0),
  };
};

// Self BV
export const getSelfBVRepo = async (userId: number) => {
  const result = await prisma.planPurchase.aggregate({
    where: {
      user_id: userId,
      status: "APPROVED",
    },
    _sum: { BV: true },
  });

  return Number(result._sum.BV ?? 0);
};
