import express from "express";
import { verifyAdmin } from "@/middleware/verifyToken";
import * as planPurchaseProxy from "@/controllers/admin/Admin.planpurchase.controller";

export const adminPlanPurchaseRoutes = express.Router();

adminPlanPurchaseRoutes.get(
  "/pending",
  verifyAdmin,
  planPurchaseProxy.getPendingApprovalsProxy
);

adminPlanPurchaseRoutes.put(
  "/approve/:id",
  verifyAdmin,
  planPurchaseProxy.approvePurchaseProxy
);

adminPlanPurchaseRoutes.put(
  "/reject/:id",
  verifyAdmin,
  planPurchaseProxy.rejectPurchaseProxy
);
