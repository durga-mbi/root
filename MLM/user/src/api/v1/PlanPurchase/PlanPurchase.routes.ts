import express from "express";
import * as planPurchaseController from "../../../controllers/PlanPurchase.Controller";
import * as sharePurchaseController from "../../../controllers/SharePurchase.Controller";
import { getMyIncomeHistory } from "../../../controllers/Income.Controller";
import validateRequest from "@/middleware/validate-request";
import {
  planPurchaseCreateSchema,
  planPurchaseUpdateSchema,
} from "@/data/request-schemas";
import { verifyUser, verifyAdmin } from "@/middleware/verifyToken";

const planPurchaseRouter = express.Router();

planPurchaseRouter.post(
  "/",
  verifyUser,
  validateRequest(planPurchaseCreateSchema),
  planPurchaseController.createPlanPurchase,
);

planPurchaseRouter.get(
  "/my-purchases",
  verifyUser,
  planPurchaseController.getPurchasesByUser,
);

planPurchaseRouter.get(
  "/details/pending",
  verifyAdmin,
  planPurchaseController.getPendingApprovals,
);

planPurchaseRouter.get(
  "/details/:id",
  verifyUser,
  planPurchaseController.getPlanPurchaseById,
);

planPurchaseRouter.put(
  "/approve/:id",
  verifyAdmin,
  planPurchaseController.approvePurchase,
);

planPurchaseRouter.put(
  "/reject/:id",
  verifyAdmin,
  planPurchaseController.rejectPurchase,
);

/* ================= SHARE PURCHASE ROUTES ================= */

planPurchaseRouter.get(
  "/available-shares",
  verifyUser,
  sharePurchaseController.getAvailableShares,
);

planPurchaseRouter.post(
  "/share",
  verifyUser,
  sharePurchaseController.sharePlan,
);

planPurchaseRouter.get(
  "/received-shares",
  verifyUser,
  sharePurchaseController.getSharedPlansForMe,
);

planPurchaseRouter.post(
  "/accept-share",
  verifyUser,
  sharePurchaseController.acceptPlan,
);

/* ================= INCOME ROUTES ================= */

planPurchaseRouter.get(
  "/income/my-history",
  verifyUser,
  getMyIncomeHistory,
);

export default planPurchaseRouter;
