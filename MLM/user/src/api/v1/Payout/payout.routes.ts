import express from "express";
import { getMyPayouts } from "../../../controllers/payout/Payout.Controller";
import { verifyUser } from "@/middleware/verifyToken";

const payoutRouter = express.Router();

payoutRouter.use(verifyUser);

payoutRouter.get("/", getMyPayouts);

export default payoutRouter;
