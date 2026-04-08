import express from "express";
import {
  createReturnRequest,
  getReturnRequests,
  getReturnById,
  updateReturnStatus,
  cancelReturnRequest,
} from "../../../controllers/return/OrderReturnController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = express.Router();

// All return routes are protected
router.use(authenticateUser);

// POST /v1/order-returns → create a return request
router.post("/", createReturnRequest);

// GET /v1/order-returns → get all return requests
router.get("/", getReturnRequests);

// GET /v1/order-returns/:returnId → get return by ID
router.get("/:returnId", getReturnById);

// PATCH /v1/order-returns/:returnId → approve/reject return
router.patch("/:returnId", updateReturnStatus);

// PATCH /v1/order-returns/:returnId/cancel → user cancel return request
router.patch("/:returnId/cancel", cancelReturnRequest);

export default router;
