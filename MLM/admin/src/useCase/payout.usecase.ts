import {
  generatePayoutRepo,
  getPayoutDetailsRepo,
  getpayoutrepo,
  payoutHistory,
} from "@/data/repositories/payout.repo";
import prisma from "@/prisma-client";

export const generatePayoutUsecase = async () => {
  return prisma.$transaction(async (tx) => {
    // 1. Get eligible users (wallet balance > threshold)
    const { payout, eligibleUsers } = await generatePayoutRepo(tx);

    let totalGrossBatch = 0;
    let totalNetBatch = 0;
    let totalTdsBatch = 0;
    let totalAdminBatch = 0;

    for (const wallet of eligibleUsers) {
      // Sources of truth:
      // 1. wallet.total_income is the current available balance (Net)
      // 2. incomeHistory is the breakdown record

      const availableBalance = Number(wallet.total_income);

      // Fetch total deductions already recorded for this user
      const historySummary = await tx.incomeHistory.aggregate({
        where: { userId: wallet.user.id },
        _sum: {
          totalIncome: true,
          tds: true,
          adminCharges: true,
        },
      });

      let userGross = Number(
        historySummary._sum.totalIncome || availableBalance,
      );
      let userTds = Number(historySummary._sum.tds || 0);
      let userAdmin = Number(historySummary._sum.adminCharges || 0);

      // Calculate Net according to user's requirement: Net = Gross - (TDS + Admin)
      let userNet = userGross - (userTds + userAdmin);

      // Edge case: If for some reason the calculated net is vastly different from available balance
      // (e.g. manual wallet updates or partial history), we prioritize paying out the available balance
      if (userNet <= 0 && availableBalance > 0) {
        userNet = availableBalance;
        userGross = availableBalance;
        userTds = 0;
        userAdmin = 0;
      }

      totalGrossBatch += userGross;
      totalTdsBatch += userTds;
      totalAdminBatch += userAdmin;
      totalNetBatch += userNet;

      await tx.usersPayoutHistory.create({
        data: {
          userId: wallet.user.id,
          payoutId: payout.id,
          totalAmount: userGross,
          tdsAmount: userTds,
          adminCharges: userAdmin,
          netAmount: userNet,
          status: "ACTIVE",
        },
      });

      // 2. Clear wallet income balance and move to withdraw history
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          total_income: 0,
          total_withdraw: { increment: userNet },
        },
      });
    }

    // 3. Update the batch summary with CORRECT totals
    const updatedPayout = await tx.payout.update({
      where: { id: payout.id },
      data: {
        totalAmount: totalGrossBatch,
        tds: totalTdsBatch,
        adminCharges: totalAdminBatch,
        netAmount: totalNetBatch,
      },
    });

    return updatedPayout;
  });
};

export const payoutUsecase = async (page: number, limit: number) => {
  if (!page || page < 1) page = 1;
  if (!limit) limit = 10;
  if (limit > 100) limit = 100;
  return await getpayoutrepo(page, limit);
};

export const payoutHistoryUsecase = async (page: number, limit: number) => {
  if (!page || page < 1) page = 1;
  if (!limit) limit = 10;
  if (limit > 100) limit = 100;
  return await payoutHistory(page, limit);
};

export const getPayoutDetailsUsecase = async (
  payoutId: number,
  page: number,
  limit: number,
) => {
  if (!page || page < 1) page = 1;
  if (!limit) limit = 10;
  return await getPayoutDetailsRepo(payoutId, page, limit);
};
