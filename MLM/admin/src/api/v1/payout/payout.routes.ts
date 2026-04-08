import {
  generatePayoutController,
  payoutController,
  getPayoutDetailsController,
  payouthistoryController,
} from "@/controllers/payout.controller";
import { verifyAdmin } from "@/middleware/verifyToken";
import express from "express";
export const payoutRouter = express.Router();
payoutRouter.post("/generate", verifyAdmin, generatePayoutController);
payoutRouter.get("/get", verifyAdmin, payoutController);
payoutRouter.get("/history", verifyAdmin, payouthistoryController);
payoutRouter.get("/:id/details", verifyAdmin, getPayoutDetailsController);
