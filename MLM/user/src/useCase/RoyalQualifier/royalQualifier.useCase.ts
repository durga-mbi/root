import prisma from "../../prisma-client";
import { Prisma, RoyalQualifier } from "@prisma/client";
import * as royalRepo from "../../data/repositories/RoyalQualifier.Repository";


// export const createRoyalQualifierService = async (
//   userId: number,
//   childId: number,
//   tx?: Prisma.TransactionClient,
// ): Promise<RoyalQualifier> => {
//   const client = tx ?? prisma;

//   if (!userId || !childId) {
//     throw new Error("userId and childId are required");
//   }

//   if (userId === childId) {
//     throw new Error("User cannot qualify themselves");
//   }

//   // const count = await client.user.count({
//   //   where: {
//   //     sponsorId: userId,
//   //     id: { not: childId },
//   //   },
//   // });

//   //more than 2 direct sponsers
//   // _ConfigRoyalPlans.plan_id == user.planId
//   // plan purchase should be first_purchase and not expired

//   // elebligile for qualify

//   const [user, child] = await Promise.all([
//     client.user.findUnique({ where: { id: userId } }),
//     client.user.findUnique({ where: { id: childId } }),
//   ]);

//   if (!user) throw new Error("Parent user not found");
//   if (!child) throw new Error("Child user not found");

//   const existing = await client.royalQualifier.findUnique({
//     where: {
//       userId_childId: { userId, childId },
//     },
//   });

//   if (existing) {
//     return existing;
//   }

//   return royalRepo.createRoyalQualifier(userId, childId, client);
// };

export const createRoyalQualifierService = async (
  userId: number, // sponsorId
  childId: number,
  planId: number,
  purchaseType: string,
  tx: Prisma.TransactionClient,
): Promise<RoyalQualifier | null> => {
  if (!userId || !childId) {
    throw new Error("userId and childId are required");
  }

  if (userId === childId) {
    throw new Error("User cannot qualify themselves");
  }

  if (purchaseType !== "FIRST_PURCHASE") {
    return null;
  }

  const isRoyal = await tx.configRoyalPlan.count({
    where: { planid: planId },
  });

  if (isRoyal === 0) {
    return null;
  }

  const sponsorUser = await tx.user.findUnique({
    where: { id: userId },
  });

  if (!sponsorUser) return null;

  const isEligible =
    sponsorUser.leftChildId !== null &&
    sponsorUser.rightChildId !== null &&
    sponsorUser.directCount > 2;

  if (!isEligible) {
    return null;
  }

  const existing = await tx.royalQualifier.findUnique({
    where: {
      userId_childId: { userId, childId },
    },
  });

  if (existing) {
    return existing;
  }

  return tx.royalQualifier.create({
    data: {
      userId,
      childId,
    },
  });
};