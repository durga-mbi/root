import express from "express";
import * as addressController from "../../../controllers/address/Address.Controller";
import { verifyUser } from "@/middleware/verifyToken";

const addressRouter = express.Router();

addressRouter.use(verifyUser);

addressRouter.get("/", addressController.getAddresses);
addressRouter.post("/", addressController.addAddress);
addressRouter.put("/:id", addressController.updateAddress);
addressRouter.delete("/:id", addressController.deleteAddress);

export default addressRouter;
