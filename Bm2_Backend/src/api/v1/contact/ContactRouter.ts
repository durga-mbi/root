import { Router } from "express";
import { ContactController } from "../../../controllers/content/ContactController";

const router = Router();

// Public routes
// Get Contact Information
router.get("/info", ContactController.getInfo);
// Enquiry of Contacts
router.post("/enquiry", ContactController.submitEnquiry);

export default router;
