import express, { Router } from "express";
import { getConfigController } from "@/controllers/Config.Controller";

const configRouter: Router = express.Router();

configRouter.get("/", getConfigController);

export default configRouter;
