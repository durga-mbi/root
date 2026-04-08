import prisma from "@/prisma-client";
import {
  elegibleForincome,
  getIncomePercentage,
  getRoyalityPercentage,
  getTDS,
  getWalletCarryBV,
} from "@/utils/incomeHelper";
import { getUserTotalBVRepo } from "./Admin.totalbv.repo";

export const getIncomeGenarateRepo = async () => {
  console.log("🚀 Income Generation Started...");

  return prisma.$transaction(async (tx) => {
    const eligibleUsers = await elegibleForincome();
    const incomePercentage = await getIncomePercentage();
    const royaltyPercentage = await getRoyalityPercentage();
    const { tds, admincharges } = await getTDS();
    const batch = await tx.generateIncome.create({
      data: {
        totalIncome: 0,
        binaryIncome: 0,
        royaltyIncome: 0,
        netincome: 0,
        tds: 0,
        adminCharges: 0,
        generatedDate: new Date(),
      },
    });

    let totalBinary = 0;
    let totalRoyalty = 0;
    let totalTds = 0;
    let totalAdmin = 0;
    let totalNet = 0;

    const userIncomeMap = new Map<
      number,
      {
        binary: number;
        royalty: number;
        netBinary: number;
        netRoyality: number;
        tds: number;
        admin: number;
      }
    >();

    // ================= BINARY =================
    for (const u of eligibleUsers) {
      const userId = u.user_id;

      const { leftBV, rightBV } = await getUserTotalBVRepo(userId);

      const wallet = await tx.wallet.findUnique({
        where: { user_id: userId },
      });

      const prevTotalLeft = wallet?.total_left_bv || 0;
      const prevTotalRight = wallet?.total_right_bv || 0;
      const prevLeftCarry = wallet?.left_carryforward_bv || 0;
      const prevRightCarry = wallet?.right_carryforward_bv || 0;

      const newLeftBV = Math.max(leftBV - prevTotalLeft, 0);
      const newRightBV = Math.max(rightBV - prevTotalRight, 0);

      const totalLeft = prevLeftCarry + newLeftBV;
      const totalRight = prevRightCarry + newRightBV;

      const matchedBv = Math.floor(Math.min(totalLeft, totalRight));

      if (matchedBv <= 0) {
        await tx.wallet.upsert({
          where: { user_id: userId },
          update: {
            total_left_bv: leftBV,
            total_right_bv: rightBV,
            left_carryforward_bv: totalLeft,
            right_carryforward_bv: totalRight,
          },
          create: {
            user_id: userId,
            total_income: 0,
            total_left_bv: leftBV,
            total_right_bv: rightBV,
            left_carryforward_bv: totalLeft,
            right_carryforward_bv: totalRight,
          },
        });
        continue;
      }

      const newLeftCarry = totalLeft - matchedBv;
      const newRightCarry = totalRight - matchedBv;

      const gross = (matchedBv * incomePercentage) / 100;
      if (gross <= 0) continue;

      const bTds = (gross * tds) / 100;
      const bAdmin = (gross * admincharges) / 100;
      const bNet = gross - bTds - bAdmin;

      totalBinary += gross;
      totalTds += bTds;
      totalAdmin += bAdmin;
      totalNet += bNet;

      const binaryEntry = await tx.systemIncome.create({
        data: {
          user_id: userId,
          generateIncomeId: batch.id,
          matched_bv: matchedBv,
          income: bNet, // Updated to use net income for consistency
          message_data: `Binary match ${matchedBv}`,
          status: "ACTIVE",
        },
      });

      await tx.wallet.upsert({
        where: { user_id: userId },
        update: {
          total_left_bv: leftBV,
          total_right_bv: rightBV,
          left_carryforward_bv: newLeftCarry,
          right_carryforward_bv: newRightCarry,
          matched_bv: (wallet?.matched_bv || 0) + matchedBv,
          total_income: { increment: bNet }, // Now correctly increments by net income
        },
        create: {
          user_id: userId,
          total_income: bNet,
          matched_bv: matchedBv,
          total_left_bv: leftBV,
          total_right_bv: rightBV,
          left_carryforward_bv: newLeftCarry,
          right_carryforward_bv: newRightCarry,
        },
      });

      await tx.walletTransaction.create({
        data: {
          user_id: userId,
          type: "INCOME",
          amount: bNet,
          reference_id: binaryEntry.id,
          message: "Binary Income",
          status: "ACTIVE",
        },
      });

      const mapData = userIncomeMap.get(userId) || {
        binary: 0,
        royalty: 0,
        netBinary: 0,
        netRoyality: 0,
        tds: 0,
        admin: 0,
      };

      mapData.binary += gross;
      mapData.tds += bTds;
      mapData.admin += bAdmin;
      mapData.netBinary += bNet;

      userIncomeMap.set(userId, mapData);
    }
    const relations = await tx.royalQualifier.findMany({
      where: { status: "ACTIVE" },
    });

    for (const relation of relations) {
      const parentId = relation.userId;
      const childId = relation.childId;

      const childIncomes = await tx.systemIncome.findMany({
        where: {
          user_id: childId,
          generateIncomeId: batch.id,
        },
      });

      if (!childIncomes.length) continue;

      const childTotal = childIncomes.reduce(
        (sum, r) => sum + Number(r.income),
        0
      );

      if (childTotal <= 0) continue;

      const gross = (childTotal * royaltyPercentage) / 100;

      const rTds = (gross * tds) / 100;
      const rAdmin = (gross * admincharges) / 100;
      const rNet = gross - rTds - rAdmin;

      totalRoyalty += gross;
      totalTds += rTds;
      totalAdmin += rAdmin;
      totalNet += rNet;

      const royaltyEntry = await tx.royalClubIncome.create({
        data: {
          user_id: parentId,
          generateIncomeId: batch.id,
          income: gross,
          message_data: `${royaltyPercentage}% from child ${childId}`,
          status: "ACTIVE",
        },
      });

      await tx.wallet.upsert({
        where: { user_id: parentId },
        update: {
          total_income: { increment: rNet },
        },
        create: {
          user_id: parentId,
          total_income: rNet,
        },
      });

      await tx.walletTransaction.create({
        data: {
          user_id: parentId,
          type: "INCOME",
          amount: rNet,
          reference_id: royaltyEntry.id,
          message: `Royalty from child ${childId}`,
          status: "ACTIVE",
        },
      });

      const mapData = userIncomeMap.get(parentId) || {
        binary: 0,
        royalty: 0,
        netBinary: 0,
        netRoyality: 0,
        tds: 0,
        admin: 0,
      };

      mapData.royalty += gross;
      mapData.tds += rTds;
      mapData.admin += rAdmin;
      mapData.netRoyality += rNet;

      userIncomeMap.set(parentId, mapData);
    }

    for (const [userId, data] of userIncomeMap.entries()) {
      await tx.incomeHistory.create({
        data: {
          incomeId: batch.id,
          userId,
          totalIncome: data.binary + data.royalty,
          netincome: data.netBinary + data.netRoyality,
          tds: data.tds,
          adminCharges: data.admin,
        },
      });
    }

    await tx.generateIncome.update({
      where: { id: batch.id },
      data: {
        totalIncome: totalBinary + totalRoyalty,
        binaryIncome: totalBinary,
        royaltyIncome: totalRoyalty,
        tds: totalTds,
        adminCharges: totalAdmin,
        netincome: totalNet,
      },
    });


    return batch;
  });
};
export const genincomeGenrepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.generateIncome.findMany({
      skip,
      take: limit,
      include: {
        royaltyIncomes: true,
        systemIncomes: true,
      },
      orderBy: { generatedDate: "desc" },
    }),
    prisma.generateIncome.count(),
  ]);

  const formattedData = data.map((batch) => {
    const totalRoyalty = batch.royaltyIncomes.reduce(
      (acc, curr) => acc + Number(curr.income),
      0,
    );
    const totalBinary = batch.systemIncomes.reduce(
      (acc, curr) => acc + Number(curr.income),
      0,
    );
    return { ...batch, totalRoyalty, totalBinary };
  });

  return {
    data: formattedData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getIncomeByBatchRepo = async (
  batchId: number,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const systemIncomes = await prisma.systemIncome.findMany({
    where: { generateIncomeId: batchId },
    include: { user: true },
  });

  const royaltyIncomes = await prisma.royalClubIncome.findMany({
    where: { generateIncomeId: batchId },
    include: { user: true },
  });

  const historyRecords = await prisma.incomeHistory.findMany({
    where: { incomeId: batchId },
  });

  const merged: Record<number, any> = {};

  for (const si of systemIncomes) {
    if (!merged[si.user_id]) {
      merged[si.user_id] = {
        userId: si.user_id,
        name: `${si.user.firstName} ${si.user.lastName}`.trim(),
        memId: si.user.memberId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalTds: 0,
        totalAdminCharges: 0,
      };
    }
    merged[si.user_id].binaryIncome += Number(si.income);
  }

  for (const ri of royaltyIncomes) {
    if (!merged[ri.user_id]) {
      merged[ri.user_id] = {
        userId: ri.user_id,
        name: `${ri.user.firstName} ${ri.user.lastName}`.trim(),
        memId: ri.user.memberId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalTds: 0,
        totalAdminCharges: 0,
      };
    }
    merged[ri.user_id].royaltyIncome += Number(ri.income);
  }

  for (const hr of historyRecords) {
    if (merged[hr.userId]) {
      merged[hr.userId].totalTds += Number(hr.tds);
      merged[hr.userId].totalAdminCharges += Number(hr.adminCharges);
    }
  }

  const finalData = Object.values(merged).map((user: any) => {
    const totalGross = user.binaryIncome + user.royaltyIncome;
    const netIncome = totalGross - user.totalTds - user.totalAdminCharges;
    return {
      ...user,
      binaryIncome: Number(user.binaryIncome.toFixed(2)),
      royaltyIncome: Number(user.royaltyIncome.toFixed(2)),
      tds: Number(user.totalTds.toFixed(2)),
      adminCharges: Number(user.totalAdminCharges.toFixed(2)),
      netIncome: Number(netIncome.toFixed(2)),
    };
  });

  const paginatedData = finalData.slice(skip, skip + limit);

  return {
    data: paginatedData,
    total: finalData.length,
    page,
    limit,
    totalPages: Math.ceil(finalData.length / limit),
  };
};

export const incomeHistoryRepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const rows = await prisma.incomeHistory.findMany();
  const merged: Record<number, any> = {};

  for (const row of rows) {
    if (!merged[row.userId]) {
      merged[row.userId] = {
        userId: row.userId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalTds: 0,
        totalAdminCharges: 0,
      };
    }

    const income = Number(row.totalIncome ?? 0);
    const tds = Number(row.tds ?? 0);
    const admin = Number(row.adminCharges ?? 0);

    merged[row.userId].totalTds += tds;
    merged[row.userId].totalAdminCharges += admin;

    if (row.incomeId === 1 || row.incomeId === 2) {
      merged[row.userId].binaryIncome += income;
    } else if (row.incomeId === 3) {
      merged[row.userId].royaltyIncome += income;
    }
  }

  const userIds = Object.keys(merged).map(Number);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, memberId: true },
  });

  const userMap: Record<number, any> = {};
  users.forEach((u) => {
    userMap[u.id] = u;
  });

  const finalData = Object.values(merged).map((user: any) => {
    const totalInc = user.binaryIncome + user.royaltyIncome;
    const netInc = totalInc - user.totalTds - user.totalAdminCharges;

    return {
      userId: user.userId,
      name: `${userMap[user.userId]?.firstName ?? ""} ${userMap[user.userId]?.lastName ?? ""}`.trim(),
      memId: userMap[user.userId]?.memberId || null,
      binaryIncome: Number(user.binaryIncome.toFixed(2)),
      royaltyIncome: Number(user.royaltyIncome.toFixed(2)),
      tds: Number(user.totalTds.toFixed(2)),
      adminCharges: Number(user.totalAdminCharges.toFixed(2)),
      netIncome: Number(netInc.toFixed(2)),
    };
  });

  const paginatedData = finalData.slice(skip, skip + limit);

  return {
    skip,
    page,
    limit,
    data: paginatedData,
    total: finalData.length,
    totalpage: Math.ceil(finalData.length / limit),
  };
};
