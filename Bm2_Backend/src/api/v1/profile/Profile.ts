import { Router } from "express";
import * as profileController from "../../../controllers/profile/ProfileController";
import validateRequest from "../../../middleware/validate-request";
import authenticateUser from "../../../middleware/authenticate-user";
import { updateProfileSchema } from "../../../data/request-schemas";
import { upload } from "../../../middleware/upload-middleware";

const router = Router();

// All routes here require authentication
router.use(authenticateUser);

/**
 * @openapi
 * /v1/profile/me:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get("/me", profileController.getProfile);

/**
 * @openapi
 * /v1/profile/me:
 *   patch:
 *     tags:
 *       - Profile
 *     summary: Update current user profile (Details + Optional Photo)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch(
  "/me",
  upload.single("profileImage"),
  validateRequest(updateProfileSchema),
  profileController.updateProfile,
);

/**
 * @openapi
 * /v1/profile/upload-photo:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Upload profile photo directly to Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post(
  "/upload-photo",
  upload.single("profileImage"),
  profileController.uploadPhoto,
);

export default router;
