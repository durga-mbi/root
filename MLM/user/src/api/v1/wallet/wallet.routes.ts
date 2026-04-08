import express from "express";
import { verifyUser } from "@/middleware/verifyToken";
import { getWalletController, getWalletHistoryController } from "@/controllers/wallet/wallet.controller";
import validateRequest from "@/middleware/validate-request";
import { walletQuerySchema } from "@/data/request-schemas";

const walletRouter = express.Router();

walletRouter.use(verifyUser);
walletRouter.get(
  "/get",
  validateRequest(walletQuerySchema),
  getWalletController,
);

walletRouter.get(
  "/history",
  getWalletHistoryController,
);

export default walletRouter;
