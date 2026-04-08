import { Prisma } from "@prisma/client";

export const getUserWallets = async (
  userId: number,
  tx: Prisma.TransactionClient,
) => {
  return tx.wallet.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserWallet = async (
  userId: number,
  tx: Prisma.TransactionClient,
) => {
  return tx.wallet.findUnique({
    where: {
      user_id: userId,
    },
  });
};

export const updateWalletBalance = async (
  userId: number,
  dpAmount: number,
  tx: Prisma.TransactionClient,
) => {
  return tx.wallet.update({
    where: {
      user_id: userId,
    },
    data: {
      balance_dp_amount: {
        decrement: dpAmount,
      },
    },
  });
};

export const updateWalletDP = async (
  userId: number,
  dpAmount: number,
  tx: Prisma.TransactionClient,
) => {
  return tx.wallet.upsert({
    where: {
      user_id: userId,
    },
    update: {
      total_dp_amount: {
        increment: dpAmount,
      },
      balance_dp_amount: {
        increment: dpAmount,
      },
    },
    create: {
      user_id: userId,
      total_dp_amount: dpAmount,
      balance_dp_amount: dpAmount,
      status: "ACTIVE",
    },
  });
};

export const getUserWalletByDateRange = async (
  userId: number,
  fromDate: Date,
  toDate: Date,
  tx: Prisma.TransactionClient,
) => {
  return tx.walletTransaction.findMany({
    where: {
      user_id: userId,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
