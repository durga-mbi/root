import AppError from "@/errors/AppError";
import * as planPurchaseRepo from "../../data/repositories/PlanPurchase.Repository";
import * as userRepo from "../../data/repositories/Users.Repository";
import { createBVLedgerForLineageRaw } from "@/data/repositories/BVledger.Repository";
import prisma from "@/prisma-client";

export const getAvailableSharesForUser = async (userId: number) => {
  return planPurchaseRepo.findAvailableShares(userId);
};

export const sharePlanToDirect = async (
  sponsorId: number,
  purchaseId: number,
  directId: number,
) => {
  const purchase = await planPurchaseRepo.findShareByIdAndSponsor(
    purchaseId,
    sponsorId,
  );

  if (!purchase) {
    throw AppError.notFound("Share purchase not found or unauthorized");
  }

  if (purchase.share_status !== "AVAILABLE") {
    throw AppError.badRequest("Plan is already shared or transferred");
  }

  const directUser = await userRepo.getUserById(directId);
  if (!directUser || directUser.sponsorId !== sponsorId) {
    throw AppError.badRequest("User is not your direct child");
  }

  const existingFirstPurchase = await planPurchaseRepo.findByUserFirstPurchase(directId);
  if (existingFirstPurchase) {
      throw AppError.badRequest("User already has a first purchase");
  }

  return planPurchaseRepo.sharePlanWithDirect(purchaseId, directId);
};

export const getSharedPlansForUser = async (userId: number) => {
  return planPurchaseRepo.findSharesWaitingForAcceptance(userId);
};

export const acceptSharedPlan = async (userId: number, purchaseId: number) => {
  return prisma.$transaction(async (tx) => {
    const sharePurchase = await tx.planPurchase.findFirst({
      where: {
        id: purchaseId,
        transferred_to_user_id: userId,
        share_status: "RESERVED",
      },
    });

    if (!sharePurchase) {
      throw AppError.notFound("Shared plan not found or not assigned to you");
    }

    const existingFirstPurchase = await tx.planPurchase.findFirst({
        where: { user_id: userId, purchase_type: "FIRST_PURCHASE" }
    });

    if (existingFirstPurchase) {
        throw AppError.badRequest("You already have a first purchase");
    }

    const user = await tx.user.findUnique({ where: { id: userId } });
    const fullname = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

    // 1. Create FIRST_PURCHASE for the child
    const firstPurchase = await tx.planPurchase.create({
      data: {
        plan_id: sharePurchase.plan_id,
        user_id: userId,
        BV: sharePurchase.BV,
        dp_amount: sharePurchase.dp_amount,
        plan_amount: sharePurchase.plan_amount,

        purchase_type: "FIRST_PURCHASE",
        status: "APPROVED",
        approve_status: "AUTO",
        approved_at: new Date(),
        is_income_generated: "NO",

        parent_purchase_id: sharePurchase.id,
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
      },
    });

    // 2. Mark sponsor's share as TRANSFERRED
    await tx.planPurchase.update({
      where: { id: sharePurchase.id },
      data: {
        share_status: "TRANSFERRED",
        transferred_at: new Date(),
        updatedBy: fullname || "SYSTEM",
      },
    });

    // 3. Generate BV for lineage
    await createBVLedgerForLineageRaw(
      {
        purchase_id: firstPurchase.id,
        buyer_id: userId,
        bv: firstPurchase.BV,
        purchase_type: "FIRST_PURCHASE",
        is_income_generated: "NO",
      },
      tx,
    );

    return firstPurchase;
  });
};
