// import prisma from "@/prisma-client";
// import { getRoyalityPercentage, getTDS } from "@/utils/incomeHelper";

// export const generateRoyaltyIncomeForAll = async () => {
//   try {
//     const royaltyPercentage = await getRoyalityPercentage();
//     const { tds, admincharges } = await getTDS();

//     const relations = await prisma.royalQualifier.findMany({
//       where: { status: "ACTIVE" },
//     });

//     if (!relations.length) {
//       console.log("No royalty relations found");
//       return [];
//     }

//     const lastBatch = await prisma.generateIncome.findFirst({
//       orderBy: { generatedDate: "desc" },
//     });

//     const lastBatchDate = lastBatch?.generatedDate ?? new Date(0);

//     const batch = await prisma.generateIncome.create({
//       data: {
//         totalIncome: 0,
//         tds: 0,
//         netincome: 0,
//         adminCharges: 0,
//         generatedDate: new Date(),
//       },
//     });

//     let totalIncome = 0;
//     let totalTds = 0;
//     let totalAdmin = 0;
//     let totalNetIncome = 0;

//     const result: any[] = [];

//     await prisma.$transaction(async (tx) => {
//       for (const relation of relations) {
//         const parentId = relation.userId;
//         const childId = relation.childId;

//         const childRecentIncome = await tx.incomeHistory.aggregate({
//           _sum: {
//             totalIncome: true,
//           },
//           where: {
//             userId: childId,
//             createdAt: {
//               gt: lastBatchDate,
//             },
//           },
//         });

//         const childIncome = Number(childRecentIncome._sum.totalIncome || 0);

//         if (childIncome <= 0) continue;

//         const grossIncome = (childIncome * royaltyPercentage) / 100;
//         console.log(grossIncome);

//         if (grossIncome <= 0) continue;

//         const tdsAmount = (grossIncome * tds) / 100;
//         const adminAmount = (grossIncome * admincharges) / 100;
//         const netIncome = grossIncome - tdsAmount - adminAmount;

//         totalIncome += grossIncome;
//         totalTds += tdsAmount;
//         totalAdmin += adminAmount;
//         totalNetIncome += netIncome;

//         const royaltyEntry = await tx.royalClubIncome.create({
//           data: {
//             user_id: parentId,
//             generateIncomeId: batch.id,
//             income: grossIncome,
//             message_data: `Royalty income generated from child ${childId}`,
//             status: "ACTIVE",
//           },
//         });

//         await tx.incomeHistory.create({
//           data: {
//             incomeId: batch.id,
//             userId: parentId,
//             totalIncome: grossIncome,
//             tds: tdsAmount,
//             adminCharges: adminAmount,
//           },
//         });

//         const existingWallet = await tx.wallet.findUnique({
//           where: { user_id: parentId },
//         });

//         if (existingWallet) {
//           await tx.wallet.update({
//             where: { user_id: parentId },
//             data: {
//               total_income: { increment: grossIncome },
//             },
//           });
//         } else {
//           await tx.wallet.create({
//             data: {
//               user_id: parentId,
//               total_income: grossIncome,
//             },
//           });
//         }

//         await tx.walletTransaction.create({
//           data: {
//             user_id: parentId,
//             type: "INCOME",
//             amount: grossIncome,
//             reference_id: royaltyEntry.id,
//             message: "Royalty income credited",
//             status: "ACTIVE",
//           },
//         });

//         result.push({
//           parentId,
//           childId,
//           grossIncome,
//           netIncome,
//         });
//       }
//     });

//     await prisma.generateIncome.update({
//       where: { id: batch.id },
//       data: {
//         totalIncome,
//         tds: totalTds,
//         adminCharges: totalAdmin,
//         netincome: totalNetIncome,
//       },
//     });

//     console.log("Royalty income generated successfully");

//     return result;
//   } catch (error) {
//     console.error("Royalty generation failed:", error);
//     throw error;
//   }
// };
