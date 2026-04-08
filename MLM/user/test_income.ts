import { PrismaClient } from "@prisma/client";
import { processMatchingIncomeForUser } from "./src/useCase/system_income/processMatchingIncome.useCase";

const prisma = new PrismaClient();

async function testCalculation() {
  console.log("--- Starting Income Calculation Test ---");
  
  // 1. Setup Test Config
  await prisma.config.upsert({
    where: { id: 1 },
    update: {
      incomeCommission: 10,  // 10%
      tds: 5,               // 5%
      admincharges: 5,      // 5%
    },
    create: {
      id: 1,
      prefixMemId: "TEST",
      minLength: 6,
      plan_config_key: "AUTO",
      incomeCommission: 10,
      tds: 5,
      admincharges: 5,
      deliveryCharge: 0
    }
  });
  
  // 2. Setup Test User
  const userId = 25; // Matching user BMPL000025 if exists or create dummy
  
  // Clean old test BV
  await prisma.bVLedger.deleteMany({ where: { user_id: userId } });

  // Add fresh BV (15000 on each side)
  await prisma.bVLedger.createMany({
    data: [
      { user_id: userId, buyer_id: 1, bv: 15000, buyer_leg: "LEFT", is_income_generated: "NO", purchase_id: 1, purchase_type: "FIRST_PURCHASE" },
      { user_id: userId, buyer_id: 2, bv: 15000, buyer_leg: "RIGHT", is_income_generated: "NO", purchase_id: 2, purchase_type: "FIRST_PURCHASE" },
    ]
  });

  // 3. Process Income
  await prisma.$transaction(async (tx) => {
    const result = await processMatchingIncomeForUser(userId, tx);
    console.log("Calculation Result:", JSON.stringify(result, null, 2));
  });

  // 4. Verify Database Records
  const income = await prisma.incomeHistory.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { generateIncome: true }
  });

  console.log("Stored Records:");
  if (income) {
    console.log("- Gross:", income.totalIncome.toString());
    console.log("- TDS:", income.tds.toString());
    console.log("- Admin:", income.adminCharges.toString());
    console.log("- Net:", income.netincome.toString());
  } else {
    console.log("No record found!");
  }
  
  console.log("--- Test Complete ---");
}

testCalculation().catch(console.error).finally(() => prisma.$disconnect());
