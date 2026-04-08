import prisma from "@/prisma-client";

export const getDashboardStatsRepo = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const plans = await prisma.plansMaster.findMany({
    where: {
      planName: {
        in: ["silveribo", "ibo", "goldibo", "staribo"],
      },
    },
  });

  const silverPlanId = plans.find((p) => p.planName === "silveribo")?.id;
  const iboPlanId = plans.find((p) => p.planName === "ibo")?.id;
  const goldPlanId = plans.find((p) => p.planName === "goldibo")?.id;
  const starPlanId = plans.find((p) => p.planName === "staribo")?.id;

  const [
    totalUsers,
    totalPlans,
    silveribo,
    iboPlans,
    goldibo,
    staribo,
    todayIncome,
    yesterdayIncome,
    weeklyPayout,
    monthlyPayout,
    thisMonthBV,
    lastMonthBV,
    orderCountToday,
    orderDeliveredToday,
    orderDpAmountToday,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.planPurchase.count({
      where: { status: "APPROVED" },
    }),

    prisma.planPurchase.count({
      where: { plan_id: silverPlanId, status: "APPROVED" },
    }),

    prisma.planPurchase.count({
      where: { plan_id: iboPlanId, status: "APPROVED" },
    }),

    prisma.planPurchase.count({
      where: { plan_id: goldPlanId, status: "APPROVED" },
    }),

    prisma.planPurchase.count({
      where: { plan_id: starPlanId, status: "APPROVED" },
    }),

    prisma.generateIncome.aggregate({
      _sum: { totalIncome: true },
      where: {
        generatedDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    prisma.generateIncome.aggregate({
      _sum: { totalIncome: true },
      where: {
        generatedDate: {
          gte: yesterday,
          lt: today,
        },
      },
    }),

    prisma.payout.aggregate({
      _sum: { netAmount: true },
      where: { payoutCycle: "WEEKLY" },
    }),

    prisma.payout.aggregate({
      _sum: { netAmount: true },
      where: { payoutCycle: "MONTHLY" },
    }),

    prisma.planPurchase.aggregate({
      _sum: { BV: true },
      where: {
        status: "APPROVED",
        createdAt: {
          gte: startOfThisMonth,
          lt: startOfNextMonth,
        },
      },
    }),

    prisma.planPurchase.aggregate({
      _sum: { BV: true },
      where: {
        status: "APPROVED",
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfThisMonth,
        },
      },
    }),

    prisma.orderPlace.count({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),

    prisma.orderPlace.count({
      where: {
        orderStatus: "DELIVERED",
        deliveredAt: { gte: today, lt: tomorrow },
      },
    }),

    prisma.orderPlace.aggregate({
      _sum: { totalDpAmount: true },
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
  ]);

  return {
    totalUsers,
    totalPlans,
    silveribo,
    iboPlans,
    goldibo,
    staribo,

    todayIncome: todayIncome._sum.totalIncome?.toNumber() || 0,
    yesterdayIncome: yesterdayIncome._sum.totalIncome?.toNumber() || 0,

    weeklyPayout: weeklyPayout._sum.netAmount?.toNumber() || 0,
    monthlyPayout: monthlyPayout._sum.netAmount?.toNumber() || 0,

    thisMonthBV: thisMonthBV._sum.BV || 0,
    lastMonthBV: lastMonthBV._sum.BV || 0,

    todayNewOrders: orderCountToday,
    todayDeliveredOrders: orderDeliveredToday,
    todayTotalDpAmount: orderDpAmountToday._sum.totalDpAmount?.toNumber() || 0,
  };
};
