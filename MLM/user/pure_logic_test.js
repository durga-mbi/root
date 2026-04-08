// Mocking the config and calculation logic from processMatchingIncome.useCase.ts

const config = {
  incomeCommission: 10,  // 10%
  tds: 5,               // 5%
  admincharges: 5       // 5%
};

const matchedBV = 15000;

function calculate(matchedBV, config) {
  const commissionPercent = Number(config.incomeCommission || 0);
  const tdsPercent = Number(config.tds || 0);
  const adminPercent = Number(config.admincharges || 0);

  const grossIncome = (matchedBV * commissionPercent) / 100;
  const tdsAmount = (grossIncome * tdsPercent) / 100;
  const adminAmount = (grossIncome * adminPercent) / 100;
  const netIncome = grossIncome - tdsAmount - adminAmount;

  return {
    matchedBV,
    grossIncome,
    tdsAmount,
    adminAmount,
    netIncome
  };
}

console.log("Scenario 1: matchedBV = 15000, 10% commission, 5% TDS, 5% Admin");
console.log(JSON.stringify(calculate(15000, config), null, 2));

const config2 = {
  incomeCommission: 10,
  tds: 5,
  admincharges: 2 // old incorrect value
};

console.log("\nScenario 2: matchedBV = 15000, 10% commission, 5% TDS, 2% Admin");
console.log(JSON.stringify(calculate(15000, config2), null, 2));

console.log("\nScenario 3: matchedBV = 20000, 10% commission, 5% TDS, 5% Admin");
console.log(JSON.stringify(calculate(20000, config), null, 2));
