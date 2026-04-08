import prisma from "@/prisma-client";

// Get income commission %
export const getIncomePercentage = async () => {
  const config = await prisma.config.findFirst();

  if (!config) {
    throw new Error("Admin configuration not found");
  }

  // adjust if column name differs in schema
  return Number(config.incomeCommission ?? 0);
};
export const getRoyalityPercentage = async () => {
  const config = await prisma.config.findFirst();

  if (!config) {
    throw new Error("Admin configuration not found");
  }

  return Number(config.royaltyCommission ?? 0);
};

// Get TDS + Admin charges
export const getTDS = async () => {
  const config = await prisma.config.findFirst({
    select: {
      tds: true,
      admincharges: true,
    },
  });

  if (!config) {
    throw new Error("Admin config not found");
  }

  return {
    tds: Number(config.tds ?? 0),
    admincharges: Number(config.admincharges ?? 0),
  };
};

// Wallet carry-forward BV
export const getWalletCarryBV = async (userId: number) => {
  const wallet = await prisma.wallet.findUnique({
    where: { user_id: userId },
  });

  return {
    leftCarry: wallet?.left_carryforward_bv ?? 0,
    rightCarry: wallet?.right_carryforward_bv ?? 0,
  };
};

// Eligible users for income generation
export const elegibleForincome = async () => {
  // 1. Get all users who have pending volume in the BV ledger (is_income_generated = NO)
  const usersWithVolume = await prisma.bVLedger.findMany({
    where: {
      is_income_generated: "NO",
    },
    select: { user_id: true },
    distinct: ["user_id"],
  });

  const qualifiedUsers = [];

  for (const item of usersWithVolume) {
    const userId = item.user_id;

    const user = await prisma.user.findUnique({
      where: { id: userId, status: "ACTIVE" },
      include: {
        planPurchases: {
          where: { status: "APPROVED" },
        },
      },
    });

    if (!user) continue;

    // 3. Qualification Check
    // EXCEPTION: Root user (ID: 1) is always qualified
    if (userId === 1) {
      qualifiedUsers.push({ user_id: userId });
      continue;
    }

    // Standard user needs their own approved purchase
    if (user.planPurchases.length === 0) continue;

    // Find direct referrals sponsored by this user
    const directReferrals = await prisma.user.findMany({
      where: {
        sponsorId: userId,
        status: "ACTIVE",
      },
      include: {
        planPurchases: {
          where: { status: "APPROVED" },
        },
      },
    });

    // Filter referrals who have at least one approved plan
    const activeDirects = directReferrals.filter(
      (dr) => dr.planPurchases.length > 0,
    );

    const hasLeftDirect = activeDirects.some((dr) => dr.legPosition === "LEFT");
    const hasRightDirect = activeDirects.some(
      (dr) => dr.legPosition === "RIGHT",
    );

    if (hasLeftDirect && hasRightDirect) {
      qualifiedUsers.push({ user_id: userId });
    }
  }

  return qualifiedUsers;
};
