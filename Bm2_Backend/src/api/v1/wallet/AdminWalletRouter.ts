import { Router } from "express";
import { WalletAdminController } from "../../../controllers/wallet/WalletAdminController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// In a real system, we'd have a separate middleware for admin check
// For now, using authenticateUser as per project common patterns
router.use(authenticateUser);

// Get All Config
router.get("/config", WalletAdminController.getConfig);

// Update Config 
router.put("/config", WalletAdminController.updateConfig);
// Get Analytics
router.get("/analytics", WalletAdminController.getAnalytics);

// Get negative accounts
router.get("/negative-accounts", WalletAdminController.getNegativeAccounts);

//Send Trigger-activation
router.post("/trigger-activation", WalletAdminController.triggerActivation);

export default router;
