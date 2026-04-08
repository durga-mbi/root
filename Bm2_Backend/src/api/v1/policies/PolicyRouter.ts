import { Router } from "express";
import { PolicyController } from "../../../controllers/content/PolicyController";

const router = Router();

// Public routes
// Get all Terms & Conditions
router.get("/terms", PolicyController.getTerms);
// Get Privacy Policy
router.get("/privacy", PolicyController.getPrivacy);
// Get Return Policy
router.get("/returns", PolicyController.getReturns);
// Get Shipping Policy
router.get("/shipping", PolicyController.getShipping);

export default router;
