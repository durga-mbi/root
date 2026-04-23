import { Prisma } from "@prisma/client";
import prisma from "../../../prisma-client";

export class WalletRepository {
  // --- CONFIG ---
  async getActiveConfig() {
    return prisma.coinConfig.findFirst({
      where: { isActive: true },
      orderBy: { versionNumber: "desc" },
    });
  }

  async createConfig(data: any) {
    return prisma.$transaction(async (tx) => {
      // Deactivate current active configs
      await tx.coinConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      // Get latest version number
      const latest = await tx.coinConfig.findFirst({
        orderBy: { versionNumber: "desc" },
      });
      const nextVersion = (latest?.versionNumber || 0) + 1;

      return tx.coinConfig.create({
        data: {
          ...data,
          versionNumber: nextVersion,
          isActive: true,
        },
      });
    });
  }

  // --- USER DATA ---
  async getUserBalances(userId: number, tx?: any) {
    const client = tx || prisma;
    return client.customer.findUnique({
      where: { comId: userId },
      select: {
        coinBalance: true,
        pendingCoinBalance: true,
      },
    });
  }

  async getUserBalancesForUpdate(userId: number, tx: any) {
    // Note: raw query is used because Prisma doesn't support "FOR UPDATE" in findUnique directly in some versions
    await tx.$executeRaw`SELECT * FROM aa13_customer_db WHERE com_id = ${userId} FOR UPDATE`;
    return tx.customer.findUnique({
      where: { comId: userId },
      select: {
        id: true,
        comId: true,
        coinBalance: true,
        pendingCoinBalance: true,
      },
    });
  }

  // --- TRANSACTIONS ---
  async createTransaction(data: any, tx?: any) {
    const client = tx || prisma;
    return client.coinTransaction.create({ data });
  }

  async getTransactionsByUser(userId: number, skip = 0, take = 20) {
    return prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async getTransactionByOrderAndType(orderId: string, type: string) {
    return prisma.coinTransaction.findFirst({
      where: { orderId, type },
    });
  }

  async updateTransactionStatus(
    id: number,
    status: string,
    processedAt?: Date,
    tx?: any,
  ) {
    const client = tx || prisma;
    return client.coinTransaction.update({
      where: { id },
      data: { status, processedAt },
    });
  }

  async getPendingEligibleTransactions(batchSize: number) {
    return prisma.coinTransaction.findMany({
      where: {
        status: "PENDING",
        creditDate: { lte: new Date() },
      },
      select: {
        id: true,
        userId: true,
        orderId: true,
        type: true,
        amount: true,
        status: true,
        processedAt: true,
        configSnapshot: true,
        createdAt: true
      },
      take: batchSize,
      orderBy: { id: "asc" },
    });
  }

  // --- BALANCE UPDATES ---
  async updateBalances(
    userId: number,
    coinDelta: number,
    pendingDelta: number,
    tx: any,
  ) {
    return tx.customer.update({
      where: { comId: userId },
      data: {
        coinBalance: { increment: coinDelta },
        pendingCoinBalance: { increment: pendingDelta },
      },
    });
  }

  // --- ANALYTICS ---
  async getLiabilityMetrics() {
    const metrics = await prisma.customer.aggregate({
      _sum: {
        coinBalance: true,
        pendingCoinBalance: true,
      },
    });

    const redeemed = await prisma.coinTransaction.aggregate({
      where: { type: "REDEEM", status: "ACTIVE" },
      _sum: { amount: true },
    });

    const negativeDebt = await prisma.customer.aggregate({
      where: { coinBalance: { lt: 0 } },
      _sum: { coinBalance: true },
    });

    return {
      outstandingActiveCoins: metrics._sum.coinBalance || 0,
      totalPendingLiabilities: metrics._sum.pendingCoinBalance || 0,
      totalRedeemed: redeemed._sum.amount || 0,
      negativeDebt: Math.abs(negativeDebt._sum.coinBalance || 0),
    };
  }

  async getNegativeAccounts() {
    return prisma.customer.findMany({
      where: { coinBalance: { lt: 0 } },
      select: {
        id: true,
        comId: true,
        fullName: true,
        coinBalance: true,
      },
    });
  }
}
