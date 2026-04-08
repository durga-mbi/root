import { WalletRepository } from "../data/repositories/wallet/WalletRepository";
import prisma from "../prisma-client";

const repo = new WalletRepository();

export class WalletService {
  /**
   * Calculate and create a PENDING EARN transaction for a delivered order.
   */
  async processOrderDelivery(
    orderId: string,
    userId: number,
    orderAmount: number,
    existingTx?: any,
  ) {
    const config = await repo.getActiveConfig();
    if (!config || !config.isActive) return null;

    const existing = await repo.getTransactionByOrderAndType(orderId, "EARN");
    if (existing) return null;

    if (orderAmount < config.minEligibleAmount) return null;

    const eligibleAmount = Math.min(orderAmount, config.maxEligibleAmount);

    const randomPercent =
      Math.floor(
        Math.random() * (config.rewardPercentMax - config.rewardPercentMin + 1),
      ) + config.rewardPercentMin;

    let coins = Math.floor(eligibleAmount * (randomPercent / 100));
    coins = Math.min(coins, config.maxCoinsPerOrder);

    if (coins <= 0) return null;

    const creditDate = new Date();
    creditDate.setDate(creditDate.getDate() + config.returnPeriodDays);

    const logic = async (tx: any) => {
      const txn = await repo.createTransaction(
        {
          userId,
          orderId,
          type: "EARN",
          amount: coins,
          status: "PENDING",
          creditDate,
          configSnapshot: {
            version: (config as any).versionNumber,
            percentUsed: randomPercent,
          },
        },
        tx,
      );

      await repo.updateBalances(userId, 0, coins, tx);
      return txn;
    };

    return existingTx ? logic(existingTx) : prisma.$transaction(logic);
  }

  /**
   * Validate and process coin redemption during checkout.
   */
  async redeemCoins(
    userId: number,
    orderId: string,
    requestedAmount: number,
    currentOrderTotal: number,
    existingTx?: any,
  ) {
    const config = await repo.getActiveConfig();
    if (!config) throw new Error("Wallet system inactive");

    const logic = async (tx: any) => {
      const customer = await repo.getUserBalancesForUpdate(userId, tx);
      if (!customer) throw new Error("User not found");

      if (customer.coinBalance < 0) {
        throw new Error("Cannot redeem coins while wallet balance is negative");
      }

      const maxRedeemableValue =
        currentOrderTotal * (config.redeemPercentLimit / 100);
      const actualRedemptionAmount = Math.min(
        requestedAmount,
        customer.coinBalance,
        maxRedeemableValue,
      );

      if (actualRedemptionAmount <= 0) return 0;

      await repo.createTransaction(
        {
          userId,
          orderId,
          type: "REDEEM",
          amount: actualRedemptionAmount,
          status: "ACTIVE",
          creditDate: new Date(),
          processedAt: new Date(),
        },
        tx,
      );

      await repo.updateBalances(userId, -actualRedemptionAmount, 0, tx);

      return actualRedemptionAmount;
    };

    return existingTx ? logic(existingTx) : prisma.$transaction(logic);
  }

  /**
   * Handle Return/Refund reversals.
   */
  async handleReturn(
    orderId: string,
    userId: number,
    returnedAmount: number,
    existingTx?: any,
  ) {
    // 1. Find the original EARN transaction
    const earnTx = await repo.getTransactionByOrderAndType(orderId, "EARN");
    if (!earnTx) return;

    // If already cancelled, do nothing
    if (earnTx.status === "CANCELLED") return;

    return prisma.$transaction(async (tx) => {
      if (earnTx.status === "PENDING") {
        // SCENARIO A: Return before activation
        // Just cancel the original transaction and decrement pending
        await repo.updateTransactionStatus(
          earnTx.id,
          "CANCELLED",
          undefined,
          tx,
        );
        await repo.updateBalances(userId, 0, -earnTx.amount, tx);
      } else {
        // SCENARIO B: Refund after activation
        // Calculate proportional reversal
        const snapshot = (earnTx as any).configSnapshot || {};
        // Note: In a real system, we'd store the originalEligibleAmount in the snapshot.
        // For simplicity here, we assume proportionality based on the earned sum.
        // Reversal = (ReturnedAmt / OriginalAmt) * Earned
        // But since we capped at maxCoins, a fairer simple reversal is required.

        // Safety reversal: If we don't have original amt, we reverse the whole thing if full refund,
        // or a default proportional if we can deduce original amt.
        // Let's assume full reversal if it's a significant return for now or calculate if possible.

        const reversalAmount = earnTx.amount; // Default to full reversal for this mvp logic

        await repo.createTransaction(
          {
            userId,
            orderId,
            type: "REFUND_REVERSAL",
            amount: reversalAmount,
            status: "ACTIVE",
            creditDate: new Date(),
            processedAt: new Date(),
          },
          tx,
        );

        await repo.updateBalances(userId, -reversalAmount, 0, tx);
      }
    });
  }

  /**
   * Cron Job logic to activate pending coins.
   */
  async activatePendingCoins() {
    const batchSize = 500;
    const transactions = await repo.getPendingEligibleTransactions(batchSize);

    let processed = 0;
    for (const txn of transactions) {
      try {
        await prisma.$transaction(async (tx) => {
          // Lock customer to be safe
          await repo.getUserBalancesForUpdate(txn.userId, tx);

          // Move from pending to active
          await repo.updateBalances(txn.userId, txn.amount, -txn.amount, tx);

          // Mark txn as active
          await repo.updateTransactionStatus(txn.id, "ACTIVE", new Date(), tx);
        });
        processed++;
      } catch (err) {
        console.error(`Failed to activate transaction ${txn.id}:`, err);
      }
    }
    return processed;
  }
}
