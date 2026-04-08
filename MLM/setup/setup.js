const payload = {
  "config": {
    "autoMemId": "STATIC",
    "userRegistrationNo": 0,
    "prefixMemId": "BMPL",
    "minLength": 6,
    "planConfigKey": "PLAN_APPROVAL_MODE",
    "planConfigValue": "AUTO",
    "incomeCommission": 10,
    "royaltyCommission": 5,
    "tds": 5,
    "admincharges": 2
  },
  "rootUser": {
    "firstName": "Root",
    "lastName": "User",
    "mobile": "9937406469",
    "email": "root@example.com",
    "password": "Root@123"
  },
  "defaultAdmin": {
    "firstName": "Super",
    "lastName": "Admin",
    "mobile": "9937406469",
    "email": "admin@example.com",
    "username": "superadmin",
    "password": "Admin@123",
    "adminType": "SUPERADMIN"
  }
};

const SETUP_URL = process.env.SETUP_URL || 'http://user:3001/v1/setup';

async function runSetup() {
  console.log(`Starting system initialization at ${SETUP_URL}...`);
  let success = false;
  let retries = 0;
  const maxRetries = 30;

  while (!success && retries < maxRetries) {
    try {
      const response = await fetch(SETUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ System initialized successfully!');
        success = true;
      } else if (data.error && (data.error.message.includes('already completed') || data.error.message.includes('already exists'))) {
        console.log('ℹ️ System already initialized. Skipping.');
        success = true;
      } else {
        console.error(`❌ Setup failed (${response.status}):`, data);
        throw new Error('Setup failed');
      }
    } catch (error) {
      retries++;
      console.log(`⏳ Waiting for backend to be ready... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (!success) {
    console.error('❌ Setup failed after maximum retries.');
    process.exit(1);
  }
}

runSetup();
