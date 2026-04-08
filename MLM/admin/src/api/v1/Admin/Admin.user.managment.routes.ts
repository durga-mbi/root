import {
  getUserController,
  getUserDirectsController,
  getUserUplineController,
  updateUserController,
  updateUserstatusController,
} from "@/controllers/admin/Admin.user.mangment.controller";
import { verifyAdmin } from "@/middleware/verifyToken";
import express from "express";

export const userManageRoutes = express.Router();
userManageRoutes.get("/getuser", verifyAdmin, getUserController);
userManageRoutes.get("/upline/:id", verifyAdmin, getUserUplineController);
userManageRoutes.get("/directs/:id", verifyAdmin, getUserDirectsController);
userManageRoutes.put("/status/:id", verifyAdmin, updateUserstatusController);
userManageRoutes.put("/update/:id", verifyAdmin, updateUserController);
