import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔄 Resetting plans...");

    // 🔴 Delete old plans
    await prisma.plansMaster.deleteMany();

    // 🟢 Insert new plans
    await prisma.plansMaster.createMany({
      data: [
        {
          planName: "Starter Plan",
          Description: "MLM Starter Plan",
          BV: 5000,
          price: 5000,
          dp_amount: 100,
          status: Status.ACTIVE,
          features: [
            "1 level referral income",
            "Basic earning eligibility",
            "Training access",
            "Dashboard access",
          ],
        },
        {
          planName: "Silver Plan",
          Description: "MLM Silver Plan",
          BV: 10000,
          price: 10000,
          dp_amount: 300,
          status: Status.ACTIVE,
          features: [
            "2 level referral income",
            "Weekly payouts",
            "Higher commission",
            "Rank eligibility",
          ],
        },
        {
          planName: "Gold Plan",
          Description: "MLM Gold Plan",
          BV: 18000,
          price: 18000,
          dp_amount: 600,
          status: Status.ACTIVE,
          features: [
            "3 level referral income",
            "Leadership bonus",
            "Faster withdrawals",
            "Priority support",
          ],
        },
        {
          planName: "Platinum Plan",
          Description: "MLM Platinum Plan",
          BV: 25000,
          price: 25000,
          dp_amount: 1000,
          status: Status.ACTIVE,
          features: [
            "5 level referral income",
            "Matching bonus",
            "Monthly rewards",
            "VIP support",
          ],
        },
      ],
    });

    console.log("✅ Plans seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
