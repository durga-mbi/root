import { Router } from "express";
import { NotificationController } from "../../../controllers/notification/NotificationController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// Protect all notification routes
router.use(authenticateUser);

// Register device token
router.post("/register-device", NotificationController.registerDevice);

// Send notification (admin)
router.post("/send", NotificationController.sendNotification);

export default router;
