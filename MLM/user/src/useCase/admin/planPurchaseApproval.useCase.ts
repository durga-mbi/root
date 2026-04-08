import { Prisma, PurchaseType } from "@prisma/client";
import prisma from "@/prisma-client";
import AppError from "@/errors/AppError";
import { createBVLedgerForLineageRaw } from "@/data/repositories/BVledger.Repository";
import { updateWalletDP } from "@/data/repositories/wallet.Repository";
import * as userRepo from "@/data/repositories/Users.Repository";
import { createRoyalQualifierService } from "../RoyalQualifier/royalQualifier.useCase";
import { processRoyaltyIncome } from "../system_income/royaltyIncome.useCase";
import { processMatchingIncomeForUplines } from "../system_income/processMatchingIncome.useCase";

export const approvePlanPurchase = async (
  purchaseId: number,
  adminId?: number,
  tx?: Prisma.TransactionClient,
) => {
  if (tx) {
    const purchase = await tx.planPurchase.findUnique({
      where: { id: purchaseId },
      include: { user: true },
    });

    if (!purchase) throw AppError.notFound("Purchase not found");

    if (purchase.status === "APPROVED")
      throw AppError.badRequest("Purchase already approved");

    const updatedPurchase = await tx.planPurchase.update({
      where: { id: purchaseId },
      data: {
        status: "APPROVED",
        approved_at: new Date(),
        approve_status: "MANUALADMIN",
        approved_by: adminId,
      },
    });

    // 🔹 Credit DP to user wallet on approval
    await updateWalletDP(purchase.user_id, Number(purchase.dp_amount), tx);

    // 🔹 Process royalty qualification if sponsor exists
    if (purchase.user?.sponsorId) {
      await createRoyalQualifierService(
        purchase.user.sponsorId,
        purchase.user_id,
        purchase.plan_id,
        purchase.purchase_type,
        tx,
      );
    }

    // 🔹 Income generation moved to daily admin trigger.
    // 🔹 createBVLedgerForLineageRaw is still required to record the BV volume.
    if (purchase.purchase_type !== PurchaseType.SHARE_PURCHASE) {
      await createBVLedgerForLineageRaw(
        {
          purchase_id: purchase.id,
          buyer_id: purchase.user_id,
          bv: purchase.BV,
          purchase_type: purchase.purchase_type,
          is_income_generated: "NO",
        },
        tx,
      );
    }

    return updatedPurchase;
  }

  // Not inside transaction → create one
  return prisma.$transaction(async (trx) => {
    const purchase = await trx.planPurchase.findUnique({
      where: { id: purchaseId },
      include: { user: true },
    });

    if (!purchase) throw AppError.notFound("Purchase not found");

    if (purchase.status === "APPROVED")
      throw AppError.badRequest("Purchase already approved");

    const updatedPurchase = await trx.planPurchase.update({
      where: { id: purchaseId },
      data: {
        status: "APPROVED",
        approved_at: new Date(),
        approve_status: "MANUALADMIN",
        approved_by: adminId,
      },
    });

    // 🔹 Credit DP to user wallet on approval
    await updateWalletDP(purchase.user_id, Number(purchase.dp_amount), trx);

    // 🔹 Process royalty qualification if sponsor exists
    if (purchase.user?.sponsorId) {
      await createRoyalQualifierService(
        purchase.user.sponsorId,
        purchase.user_id,
        purchase.plan_id,
        purchase.purchase_type,
        trx,
      );
    }

    // 🔹 Income generation moved to daily admin trigger.
    // 🔹 createBVLedgerForLineageRaw is still required to record the BV volume.
    if (purchase.purchase_type !== PurchaseType.SHARE_PURCHASE) {
      await createBVLedgerForLineageRaw(
        {
          purchase_id: purchase.id,
          buyer_id: purchase.user_id,
          bv: purchase.BV,
          purchase_type: purchase.purchase_type,
          is_income_generated: "NO",
        },
        trx,
      );
    }

    return updatedPurchase;
  });
};

export const rejectPlanPurchase = async (
  purchaseId: number,
  adminId: number,
) => {
  const purchase = await prisma.planPurchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) throw AppError.notFound("Purchase not found");
  if (purchase.status !== "PENDING") {
    throw AppError.badRequest(`Purchase is already ${purchase.status.toLowerCase()}`);
  }

  return prisma.planPurchase.update({
    where: { id: purchaseId },
    data: {
      status: "REJECTED",
      approved_at: new Date(),
      approved_by: adminId,
      approve_status: "MANUALADMIN",
    },
  });
};