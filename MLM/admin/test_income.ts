import { getIncomeGenarateRepo } from "./src/data/repositories/Admin.genIncome.repo";

async function test() {
  console.log("Starting income generation test...");
  try {
    const result = await getIncomeGenarateRepo();
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error during test:", error);
  }
}

test();
