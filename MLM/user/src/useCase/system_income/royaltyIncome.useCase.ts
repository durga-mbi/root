import prisma from "@/prisma-client";
import { Prisma } from "@prisma/client";
import AppError from "@/errors/AppError";

export const processRoyaltyIncome = async (
  purchaseId: number,
  tx: Prisma.TransactionClient
) => {
  // 1. Get purchase and buyer details
  const purchase = await tx.planPurchase.findUnique({
    where: { id: purchaseId },
    include: {
      user: {
        select: {
          id: true,
          sponsorId: true,
        }
      },
      plan: true
    }
  });

  if (!purchase || !purchase.user.sponsorId) return;

  const buyerId = purchase.user_id;
  const sponsorId = purchase.user.sponsorId;

  // 2. Check if the plan is a Royalty Qualifier
  const config = await tx.config.findFirst({
    include: {
      royalQualifierPlans: {
        select: { id: true }
      }
    }
  });

  if (!config) return;

  const isQualifierPlan = config.royalQualifierPlans.some(p => p.id === purchase.plan_id);
  if (!isQualifierPlan) return;

  // 3. Check if this buyer is the 3rd or later direct referral for the sponsor
  // We count direct referrals who have at least one approved plan
  const sponsorDirects = await tx.user.findUnique({
    where: { id: sponsorId },
    include: {
      sponsoredUsers: {
        where: {
          planPurchases: {
            some: { status: "APPROVED" }
          }
        },
        orderBy: { createdAt: 'asc' },
        select: { id: true }
      }
    }
  });

  if (!sponsorDirects) return;

  const directReferrals = sponsorDirects.sponsoredUsers;
  const buyerIndex = directReferrals.findIndex(u => u.id === buyerId);

  // buyerIndex is 0-based, so 0=1st, 1=2nd, 2=3rd
  if (buyerIndex < 2) {
    // Not 3rd+ direct
    return;
  }

  // 4. Calculate Income
  const royaltyPercent = Number(config.royaltyCommission || 0);
  const tdsPercent = Number(config.tds || 0);
  const adminPercent = Number(config.admincharges || 0);

  if (royaltyPercent <= 0) return;

  const planPrice = Number(purchase.plan_amount || 0);
  const grossIncome = (planPrice * royaltyPercent) / 100;
  const tdsAmount = (grossIncome * tdsPercent) / 100;
  const adminAmount = (grossIncome * adminPercent) / 100;
  const netIncome = grossIncome - tdsAmount - adminAmount;

  if (netIncome <= 0) return;

  // 5. Store Logs & Update Wallet
  // Create a record in generate_income first to satisfy foreign key constraint in incomeHistory
  const genIncome = await tx.generateIncome.create({
    data: {
      totalIncome: grossIncome,
      netincome: netIncome,
      tds: tdsAmount,
      adminCharges: adminAmount,
      generatedDate: new Date(),
    }
  });

  const royaltyLog = await tx.royalClubIncome.create({
    data: {
      user_id: sponsorId,
      generateIncomeId: genIncome.id,
      income: grossIncome,
      message_data: `Royalty Income from 3rd+ direct referral (User ID: ${buyerId}, Plan: ${purchase.plan.planName})`,
      status: "ACTIVE",
    }
  });

  await tx.incomeHistory.create({
    data: {
      incomeId: genIncome.id,
      userId: sponsorId,
      totalIncome: grossIncome,
      netincome: netIncome,
      tds: tdsAmount,
      adminCharges: adminAmount,
    }
  });

  await tx.wallet.upsert({
    where: { user_id: sponsorId },
    update: {
      total_income: { increment: netIncome },
    },
    create: {
      user_id: sponsorId,
      total_income: netIncome,
      matched_bv: 0,
      total_left_bv: 0,
      total_right_bv: 0,
    }
  });

  await tx.walletTransaction.create({
    data: {
      user_id: sponsorId,
      type: "INCOME",
      amount: netIncome,
      reference_id: royaltyLog.id,
      message: `Royalty income from direct referral ${buyerId}`,
      status: "ACTIVE",
    }
  });

  return {
    sponsorId,
    buyerId,
    grossIncome,
    netIncome
  };
};
