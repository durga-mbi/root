import prisma from "@/prisma-client";

export const generatePayoutRepo = async (tx: any) => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "short" }).toUpperCase();
  const year = now.getFullYear();
  const cycle = `${month}-${year}`;

  const payout = await tx.payout.create({
    data: {
      payoutDate: now,
      payoutCycle: cycle,
      totalAmount: 0,
      tds: 0,
      adminCharges: 0,
      netAmount: 0,
      status: "ACTIVE",
    },
  });

  const eligibleUsers = await tx.wallet.findMany({
    where: {
      total_income: { gt: 100 },
      user: {
        status: "ACTIVE",
        kycStatus: "APPROVED",
      },
    },
    include: { user: true },
  });

  console.log(eligibleUsers);

  return { payout, eligibleUsers };
};

export const getpayoutrepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.payout.findMany({
      skip,
      take: limit,
    }),
    prisma.payout.count(),
  ]);
  return {
    page,
    total,
    limit,
    data,
    totalpage: Math.ceil(total / limit),
  };
};

export const payoutHistory = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.usersPayoutHistory.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.usersPayoutHistory.count(),
  ]);
  return {
    skip,
    limit,
    page,
    data,
    total,
    taoatlpage: Math.ceil(total / limit),
  };
};

export const getPayoutDetailsRepo = async (
  payoutId: number,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.usersPayoutHistory.findMany({
      where: { payoutId },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            memberId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.usersPayoutHistory.count({
      where: { payoutId },
    }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
