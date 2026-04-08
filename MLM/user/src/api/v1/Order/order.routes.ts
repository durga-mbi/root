import express from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByCustomerController,
  updateOrderController,
  deleteOrderController,
} from "../../../controllers/Orders/Order.controller";
import { verifyUser } from "@/middleware/verifyToken";
import validateRequest from "@/middleware/validate-request";
import { orderCreateSchema, orderUpdateSchema } from "@/data/request-schemas";

const orderRouter = express.Router();
orderRouter.use(verifyUser);

orderRouter.post(
  "/",
  validateRequest(orderCreateSchema),
  createOrderController,
);
orderRouter.get("/", getAllOrdersController);
orderRouter.get("/:id", getOrderByIdController);
orderRouter.get("/", getOrdersByCustomerController);
orderRouter.put(
  "/:id",
  validateRequest(orderUpdateSchema),
  updateOrderController,
);
orderRouter.delete("/:id", deleteOrderController);

export default orderRouter;
