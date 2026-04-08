import validateRequest from "@/middleware/validate-request";
import express from "express";
import {
  create,
  deleteUser,
  getAll,
  getDownline,
  getLastNodeByLegController,
  getOne,
  getTeamCount,
  getUpline,
  update,
  getMyDirectsController,
  getUserUplineProfileController,
  getUserDirectsProfileController,
} from "../../../controllers/Users.controller";

import {
  loginController,
  logoutController,
  RegenAccessToken,
} from "../../../controllers/auth/auth.controller";

import {
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
} from "@/data/request-schemas";
import { verifyUser } from "@/middleware/verifyToken";

const userRouter = express.Router();
// userRouter.use(authenticateUser);

// console.log("Api is being hit in routes");
userRouter.post("/", validateRequest(userCreateSchema), create);
userRouter.post("/login", validateRequest(userLoginSchema), loginController);
userRouter.post("/regen-token", RegenAccessToken);

// console.log("Hello world")
userRouter.get("/getall", getAll);

userRouter.use(verifyUser);

userRouter.post("/logout", logoutController);

userRouter.get("/profile", getOne);
userRouter.get("/profile/upline", getUserUplineProfileController);
userRouter.get("/profile/directs", getUserDirectsProfileController);
userRouter.get("/downline", getDownline);
userRouter.get("/upline", getUpline);
userRouter.get("/my-directs", getMyDirectsController);
userRouter.put("/last-node-update", getLastNodeByLegController);
userRouter.put("/", validateRequest(userUpdateSchema), update);
userRouter.delete("/", deleteUser);

userRouter.get("/team", getTeamCount);
export default userRouter;
