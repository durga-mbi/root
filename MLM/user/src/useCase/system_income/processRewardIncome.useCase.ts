import { Prisma } from "@prisma/client";

/**
 * Check if a user has crossed any new reward milestone after a matching event.
 * Creates a RewardHistory entry if new milestone crossed.
 */
export const processRewardIncome = async (
  userId: number,
  newMatchedBV: number,
  tx: Prisma.TransactionClient
) => {
  // Get user's total matched BV after this cycle
  const wallet = await tx.wallet.findUnique({
    where: { user_id: userId },
    select: { matched_bv: true },
  });

  const totalMatchedBV = Number(wallet?.matched_bv || 0) + newMatchedBV;

  // Get all active reward configs
  const rewardConfigs = await tx.rewardConfig.findMany({
    where: {
      status: "ACTIVE",
      matchedBV: { lte: totalMatchedBV },
    },
    orderBy: { matchedBV: "asc" },
  });

  if (!rewardConfigs.length) return;

  // Get already earned rewards
  const earned = await tx.rewardHistory.findMany({
    where: { userId },
    select: { rewardId: true },
  });
  const earnedIds = new Set(earned.map((r) => r.rewardId));

  for (const reward of rewardConfigs) {
    if (earnedIds.has(reward.id)) continue;

    // New milestone crossed!
    await tx.rewardHistory.create({
      data: {
        userId,
        rewardId: reward.id,
        matchedBV: reward.matchedBV,
        giftName: reward.giftName,
      },
    });
  }
};
