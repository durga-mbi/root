import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderController,
  updateOrderStatusController,
  trackOrderController,
  cancelOrderController,
} from "../../../controllers/order/OrderController";

import authenticateUser from "../../../middleware/authenticate-user";
import validateRequest from "../../../middleware/validate-request";
import { createOrderSchema, cancelOrderSchema } from "./validation";

const router = Router();

router.use(authenticateUser);

//  Create Order
router.post("/", validateRequest(createOrderSchema), createOrderController);
// Get All order
router.get("/", getAllOrdersController);
// Get order by Order Id
router.get("/:orderId", getOrderController);
// Update Order Status
router.patch("/:orderId/status", updateOrderStatusController);

// Track All Order
router.get("/:orderId/track", trackOrderController);

// Cancel Order
router.patch(
  "/:orderId/cancel",
  validateRequest(cancelOrderSchema),
  cancelOrderController,
);

export default router;
