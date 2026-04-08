import express from "express";
 
import * as couponCodeController from "../../../controllers/coupon-codes/CouponCodeController";
import validateRequest from "../../../middleware/validate-request";
import authenticateUser from "../../../middleware/authenticate-user";
import authorizeAdmin from "../../../middleware/authorize-admin";
import {
  createCouponCodeSchema,
  updateCouponCodeSchema,
} from "../../../data/request-schemas";

const router = express.Router();

// Publicly available (authenticated)
// Search  All Coupon Code
router.get("/search", authenticateUser, couponCodeController.search);
// Get all Coupon Code
router.get("/", authenticateUser, couponCodeController.getAll);
//  Get Coupon Code by Id
router.get("/:id", authenticateUser, couponCodeController.getOne);

/**
 * ADMIN ONLY ROUTES
 */

// Create a new coupon code
router.post(
  "/",
  authenticateUser,
  authorizeAdmin,
  validateRequest(createCouponCodeSchema),
  couponCodeController.create,
);

// Update a coupon code
router.put(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  validateRequest(updateCouponCodeSchema),
  couponCodeController.update,
);

// Delete a coupon code
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  couponCodeController.remove,
);

export default router;
