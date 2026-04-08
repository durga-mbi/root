import { Router } from "express";
import authenticateUser from "../../../middleware/authenticate-user";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart,
  clearCart,
} from "../../../controllers/cart/CartController";

const router = Router();

// Add product to cart
router.post("/", authenticateUser, addToCart);

// Get cart items
router.get("/", authenticateUser, getCart);

// Update quantity by ItemId
router.put("/:itemId", authenticateUser, updateCartQuantity);

// Remove single product by ItemId
router.delete("/:itemId", authenticateUser, removeFromCart);

// Clear full cart
router.delete("/clear/all", authenticateUser, clearCart);

export default router;


// import { Router } from "express";
// import authenticateUser from "../../../middleware/authenticate-user";
// import * as cartController from "../../../controllers/cart/CartController";

// const router = Router();

// /**
//  * =========================
//  * CART ROUTES (Protected)
//  * =========================
//  */

// // Apply auth middleware to all routes
// router.use(authenticateUser);

// /**
//  * @route   POST /v1/cart
//  * @desc    Add product to cart
//  */
// router.post("/", cartController.addToCart);

// /**
//  * @route   GET /v1/cart
//  * @desc    Get cart items
//  */
// router.get("/", cartController.getCart);

// /**
//  * @route   PUT /v1/cart/:itemId
//  * @desc    Update item quantity
//  */
// router.put("/:itemId", cartController.updateCartQuantity);

// /**
//  * @route   DELETE /v1/cart/:itemId
//  * @desc    Remove single item from cart
//  */
// router.delete("/:itemId", cartController.removeFromCart);

// /**
//  * @route   DELETE /v1/cart/clear/all
//  * @desc    Clear entire cart
//  */
// router.delete("/clear/all", cartController.clearCart);

// export default router;