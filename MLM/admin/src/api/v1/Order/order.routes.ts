import express from "express";
import {
  getAllOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} from "@/controllers/Order.controller";
import { verifyAdmin } from "@/middleware/verifyToken";

const orderRouter = express.Router();

orderRouter.use(verifyAdmin);

orderRouter.get("/", getAllOrdersController);
orderRouter.get("/:id", getOrderByIdController);
orderRouter.put("/:id/status", updateOrderStatusController);

export default orderRouter;
