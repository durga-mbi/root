import { Router } from "express";
import { FaqController } from "../../../controllers/faq/FaqController";

const router = Router();

// Public routes
// Get All Faq
router.get("/", FaqController.getFaqs);
// Get all Categories of Faq
router.get("/categories", FaqController.getFaqCategories);

export default router;
