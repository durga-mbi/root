import express from "express";
import * as cartController from "../../../controllers/cart/Cart.Controller";
import { verifyUser } from "@/middleware/verifyToken";

const cartRouter = express.Router();

cartRouter.use(verifyUser);

cartRouter.get("/", cartController.getCart);
cartRouter.post("/add", cartController.addToCart);
cartRouter.put("/update", cartController.updateCartItem);
cartRouter.delete("/remove/:productId", cartController.removeFromCart);
cartRouter.delete("/clear", cartController.clearCart);

export default cartRouter;
