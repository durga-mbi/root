import express from "express";
import validateRequest from "@/middleware/validate-request";
import { userSetupSchema } from "@/data/request-schemas";
import {
  initializeSetupController,
  resetDatabaseController,
} from "@/controllers/setup.controller";

const setupRouter = express.Router();

setupRouter.post("/", validateRequest(userSetupSchema), initializeSetupController);
setupRouter.post(
  "/reset",
  validateRequest(userSetupSchema),
  resetDatabaseController,
);

export default setupRouter;
