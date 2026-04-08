// import { Router } from "express";
// import * as authController from "../../../controllers/auth/AuthController";  
// import validateRequest from "../../../middleware/validate-request";
// import authenticateUser from "../../../middleware/authenticate-user";
// import {
//   sendOtpSchema,
//   verifyOtpSchema,
//   signupSchema,
// } from "../../../data/request-schemas";

// const router = Router();

// /**
//  * @openapi
//  * /v1/auth/send-otp:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     summary: Send OTP to mobile number
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - mobile
//  *             properties:
//  *               mobile:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: OTP sent successfully
//  */
// router.post(
//   "/send-otp",
//   validateRequest(sendOtpSchema),
//   authController.sendOtp,
// );

// /**
//  * @openapi
//  * /v1/auth/resend-otp:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     summary: Resend OTP to mobile number
//  */
// router.post(
//   "/resend-otp",
//   validateRequest(sendOtpSchema),
//   authController.resendOtp,
// );

// /**
//  * @openapi
//  * /v1/auth/verify-otp:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     summary: Verify OTP and login
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - mobile
//  *               - otp
//  *             properties:
//  *               mobile:
//  *                 type: string
//  *               otp:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login successful
//  */
// router.post(
//   "/verify-otp",
//   validateRequest(verifyOtpSchema),
//   authController.verifyOtp,
// );

// /**
//  * @openapi
//  * /v1/auth/signup:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     summary: Signup a new user
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - fullName
//  *               - mobile
//  *               - email
//  *             properties:
//  *               fullName:
//  *                 type: string
//  *               mobile:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Signup successful
//  */
// router.post("/signup", validateRequest(signupSchema), authController.signup);

// /**
//  * @openapi
//  * /v1/auth/refresh-token:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     summary: Refresh access token
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               refreshToken:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Token refreshed
//  */
// router.post("/refresh-token", authController.refreshToken);

// /**
//  * @openapi
//  * /v1/auth/logout:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     summary: Logout user and clear session
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Logged out successfully
//  */
// router.post("/logout", authenticateUser, authController.logout);

// export default router;
import { Router } from "express";
import * as authController from "../../../controllers/auth/AuthController";
import validateRequest from "../../../middleware/validate-request";
import authenticateUser from "../../../middleware/authenticate-user";
import {
  sendOtpSchema,
  verifyOtpSchema,
  signupSchema,
} from "../../../data/request-schemas";

const router = Router();

/**
 * =========================
 * VALIDATORS (Reusable)
 * =========================
 */
const validateSendOtp = validateRequest(sendOtpSchema);
const validateVerifyOtp = validateRequest(verifyOtpSchema);
const validateSignup = validateRequest(signupSchema);

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

/**
 * @openapi
 * /v1/auth/send-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP to mobile number
 */
router.post("/send-otp", validateSendOtp, authController.sendOtp);

/**
 * @openapi
 * /v1/auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend OTP to mobile number
 */
router.post("/resend-otp", validateSendOtp, authController.resendOtp);

/**
 * @openapi
 * /v1/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP and login
 */
router.post("/verify-otp", validateVerifyOtp, authController.verifyOtp);

/**
 * @openapi
 * /v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Signup a new user
 */
router.post("/signup", validateSignup, authController.signup);

/**
 * @openapi
 * /v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * =========================
 * PROTECTED ROUTES
 * =========================
 */
router.use(authenticateUser);

/**
 * @openapi
 * /v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user and clear session
 *     security:
 *       - bearerAuth: []
 */
router.post("/logout", authController.logout);

export default router;