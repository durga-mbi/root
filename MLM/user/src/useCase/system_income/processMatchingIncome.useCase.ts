import { Prisma } from "@prisma/client";
import prisma from "@/prisma-client";
import { processRewardIncome } from "./processRewardIncome.useCase";

/**
 * Binary Matching Income Engine
 *
 * For a given user, this:
 * 1. Reads fresh (unprocessed) BV from the BV ledger per leg
 * 2. Adds carry-forward BV from the wallet
 * 3. Matches min(leftBV, rightBV)
 * 4. Calculates income = matchedBV * incomeCommission%
 * 5. Deducts TDS and admin charges
 * 6. Records GenerateIncome → SystemIncome → IncomeHistory
 * 7. Updates Wallet (total_income, matched_bv, carry-forward)
 * 8. Creates a WalletTransaction
 * 9. Marks BV ledger entries as income_generated = YES
 * 10. Checks for reward milestones
 */
export const processMatchingIncomeForUser = async (
  userId: number,
  tx: Prisma.TransactionClient
) => {
  // ── 1. Load config ─────────────────────────────────────────────────────
  const config = await tx.config.findFirst();
  if (!config) return;

  const commissionPercent = Number(config.incomeCommission || 0);
  if (commissionPercent <= 0) return;

  const tdsPercent = Number(config.tds || 0);
  const adminPercent = Number(config.admincharges || 0);

  // ── 2. Get current wallet for carry-forward ────────────────────────────
  const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });

  const carryLeft = Number(wallet?.left_carryforward_bv || 0);
  const carryRight = Number(wallet?.right_carryforward_bv || 0);

  // ── 3. Sum fresh (unprocessed) BV from ledger per leg ─────────────────
  const freshLeftAgg = await tx.bVLedger.aggregate({
    where: { user_id: userId, buyer_leg: "LEFT", is_income_generated: "NO" },
    _sum: { bv: true },
  });
  const freshRightAgg = await tx.bVLedger.aggregate({
    where: { user_id: userId, buyer_leg: "RIGHT", is_income_generated: "NO" },
    _sum: { bv: true },
  });

  // Collect which BV ledger IDs to mark as processed
  const freshLeftIds = (await tx.bVLedger.findMany({
    where: { user_id: userId, buyer_leg: "LEFT", is_income_generated: "NO" },
    select: { id: true },
  })).map(r => r.id);

  const freshRightIds = (await tx.bVLedger.findMany({
    where: { user_id: userId, buyer_leg: "RIGHT", is_income_generated: "NO" },
    select: { id: true },
  })).map(r => r.id);

  const freshLeft = Number(freshLeftAgg._sum.bv || 0);
  const freshRight = Number(freshRightAgg._sum.bv || 0);

  const totalLeft = freshLeft + carryLeft;
  const totalRight = freshRight + carryRight;

  if (totalLeft <= 0 || totalRight <= 0) {
    // Not enough on both sides; update carry-forward and stop
    if (freshLeft > 0 || freshRight > 0) {
      await tx.wallet.upsert({
        where: { user_id: userId },
        update: {
          total_left_bv: { increment: freshLeft },
          total_right_bv: { increment: freshRight },
          left_carryforward_bv: totalLeft,
          right_carryforward_bv: totalRight,
        },
        create: {
          user_id: userId,
          total_income: 0,
          matched_bv: 0,
          total_left_bv: freshLeft,
          total_right_bv: freshRight,
          left_carryforward_bv: totalLeft,
          right_carryforward_bv: totalRight,
        },
      });
    }
    return;
  }

  // ── 4. Calculate matching ─────────────────────────────────────────────
  const matchedBV = Math.min(totalLeft, totalRight);
  const newCarryLeft = totalLeft - matchedBV;
  const newCarryRight = totalRight - matchedBV;

  // ── 5. Calculate income ───────────────────────────────────────────────
  const grossIncome = (matchedBV * commissionPercent) / 100;
  const tdsAmount = (grossIncome * tdsPercent) / 100;
  const adminAmount = (grossIncome * adminPercent) / 100;
  const netIncome = grossIncome - tdsAmount - adminAmount;

  if (netIncome <= 0) return;

  // ── 6. Collect buyer IDs that contributed this income (for history) ───
  const leftBuyers = await tx.bVLedger.findMany({
    where: { user_id: userId, buyer_leg: "LEFT", is_income_generated: "NO" },
    select: {
      buyer_id: true,
      bv: true,
      purchase: {
        select: {
          id: true,
          purchase_type: true,
          user: { select: { firstName: true, lastName: true, memberId: true } }
        }
      }
    }
  });

  const rightBuyers = await tx.bVLedger.findMany({
    where: { user_id: userId, buyer_leg: "RIGHT", is_income_generated: "NO" },
    select: {
      buyer_id: true,
      bv: true,
      purchase: {
        select: {
          id: true,
          purchase_type: true,
          user: { select: { firstName: true, lastName: true, memberId: true } }
        }
      }
    }
  });

  // Build a human-readable message listing contributors
  const leftNames = leftBuyers.map(b =>
    `${b.purchase.user.firstName} ${b.purchase.user.lastName} (${b.purchase.user.memberId}) [${b.bv} BV]`
  ).join(", ");

  const rightNames = rightBuyers.map(b =>
    `${b.purchase.user.firstName} ${b.purchase.user.lastName} (${b.purchase.user.memberId}) [${b.bv} BV]`
  ).join(", ");

  const message = `Binary Match — Left: ${leftNames || "carry-forward"} | Right: ${rightNames || "carry-forward"} | Matched: ${matchedBV} BV`;

  // ── 7. Persist income records ─────────────────────────────────────────
  const genIncome = await tx.generateIncome.create({
    data: {
      totalIncome: grossIncome,
      netincome: netIncome,
      tds: tdsAmount,
      adminCharges: adminAmount,
      generatedDate: new Date(),
    },
  });

  await tx.systemIncome.create({
    data: {
      user_id: userId,
      generateIncomeId: genIncome.id,
      matched_bv: matchedBV,
      income: netIncome,
      message_data: message,
      status: "ACTIVE",
    },
  });

  await tx.incomeHistory.create({
    data: {
      incomeId: genIncome.id,
      userId,
      totalIncome: grossIncome,
      netincome: netIncome,
      tds: tdsAmount,
      adminCharges: adminAmount,
    },
  });

  // ── 8. Update wallet ──────────────────────────────────────────────────
  await tx.wallet.upsert({
    where: { user_id: userId },
    update: {
      total_income: { increment: netIncome },
      matched_bv: { increment: matchedBV },
      total_left_bv: { increment: freshLeft },
      total_right_bv: { increment: freshRight },
      left_carryforward_bv: newCarryLeft,
      right_carryforward_bv: newCarryRight,
    },
    create: {
      user_id: userId,
      total_income: netIncome,
      matched_bv: matchedBV,
      total_left_bv: freshLeft,
      total_right_bv: freshRight,
      left_carryforward_bv: newCarryLeft,
      right_carryforward_bv: newCarryRight,
    },
  });

  // ── 9. Create wallet transaction ──────────────────────────────────────
  await tx.walletTransaction.create({
    data: {
      user_id: userId,
      type: "INCOME",
      amount: netIncome,
      reference_id: genIncome.id,
      message: `Binary matching income: ${matchedBV} BV matched`,
      status: "ACTIVE",
    },
  });

  // ── 10. Mark BV ledger entries as processed ───────────────────────────
  if (freshLeftIds.length > 0) {
    await tx.bVLedger.updateMany({
      where: { id: { in: freshLeftIds } },
      data: { is_income_generated: "YES" },
    });
  }
  if (freshRightIds.length > 0) {
    await tx.bVLedger.updateMany({
      where: { id: { in: freshRightIds } },
      data: { is_income_generated: "YES" },
    });
  }

  // ── 11. Check reward milestones ───────────────────────────────────────
  await processRewardIncome(userId, matchedBV, tx);

  return { matchedBV, grossIncome, netIncome };
};


/**
 * Process matching income for ALL upline users affected by a purchase.
 * Called after BV ledger is created.
 */
export const processMatchingIncomeForUplines = async (
  buyerId: number,
  tx: Prisma.TransactionClient
) => {
  // Get all upline user IDs who received BV from this buyer's purchase(s)
  const buyer = await tx.user.findUnique({ where: { id: buyerId }, select: { lineagePath: true } });
  if (!buyer?.lineagePath) return;

  // Raw SQL to get upline IDs from lineage path
  const uplines = await tx.$queryRaw<{ id: number }[]>`
    SELECT id FROM users
    WHERE FIND_IN_SET(id, ${buyer.lineagePath})
      AND id <> ${buyerId}
  `;

  for (const upline of uplines) {
    try {
      await processMatchingIncomeForUser(upline.id, tx);
    } catch (e) {
      console.error(`Failed to process income for user ${upline.id}:`, e);
    }
  }
};
