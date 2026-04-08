import express from "express";
import * as userAddressController from "../../../controllers/user-addresses/UserAddressController";
import validateRequest from "../../../middleware/validate-request";
import authenticateUser from "../../../middleware/authenticate-user";
import {
  createUserAddressSchema,
  updateUserAddressSchema,
} from "../../../data/request-schemas";

const router = express.Router();

router.use(authenticateUser);
 // Get My User Address
router.get("/me", userAddressController.getMine);
// Get One User Address by Id
router.get("/:id", userAddressController.getOne);

// Create User Address
router.post(
  "/",
  validateRequest(createUserAddressSchema),
  userAddressController.create,
);

// Update  All User Address
router.put(
  "/:id",
  validateRequest(updateUserAddressSchema),
  userAddressController.update,
);
// Update Some portion of User Address
router.patch(
  "/:id",
  validateRequest(updateUserAddressSchema),
  userAddressController.update,
);

// Remove all User Address
router.delete("/:id", userAddressController.remove);

export default router;
