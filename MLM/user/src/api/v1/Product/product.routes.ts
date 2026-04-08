import express from "express";
import * as productController from "../../../controllers/product/Product.Controller";
import * as reviewController from "../../../controllers/product/Review.Controller";
import { verifyUser } from "@/middleware/verifyToken";

const productRouter = express.Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/categories", productController.getCategories);
productRouter.get("/:id", productController.getProductDetails);

productRouter.post("/review", verifyUser, reviewController.addReview);
productRouter.get("/:productId/reviews", reviewController.getProductReviews);

export default productRouter;

