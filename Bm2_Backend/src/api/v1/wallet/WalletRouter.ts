import { Router } from "express";
import { WalletController } from "../../../controllers/wallet/WalletController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// All user wallet routes are protected
router.use(authenticateUser);

// Get All Balance
router.get("/balance", WalletController.getWalletBalance);
// Get All Transaction History
router.get("/history", WalletController.getTransactionHistory);
// Get Wallet Config
router.get("/config", WalletController.getWalletConfig);
// Send Validate Redeem
router.post("/validate-redeem", WalletController.validateRedemption);

export default router;
