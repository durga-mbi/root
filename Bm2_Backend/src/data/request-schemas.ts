import Joi from "joi";

// --- Auth Schemas ---
export const sendOtpSchema = Joi.object({
  mobile: Joi.string().required().label("Mobile Number"),
})
  .unknown()
  .required();

export const verifyOtpSchema = Joi.object({
  mobile: Joi.string().required().label("Mobile Number"),
  otp: Joi.string().required().label("OTP"),
})
  .unknown()
  .required();

export const signupSchema = Joi.object({
  fullName: Joi.string().min(3).required().label("Full Name"),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .label("Mobile Number"),
  email: Joi.string().email().required().label("Email"),
})
  .unknown()
  .required();

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3).optional().label("Full Name"),
  email: Joi.string().email().optional().label("Email"),
  profileImage: Joi.string().optional().allow("", null).label("Profile Image"),
})
  .unknown()
  .required();

// --- Coupon Code Schemas ---
export const createCouponCodeSchema = Joi.object({
  name: Joi.string().max(100).optional().allow("", null),
  description: Joi.string().optional().allow("", null),
  termsConditions: Joi.string().optional().allow("", null),
  validCategory: Joi.string().max(100).optional().allow("", null),
  validBrand: Joi.string().max(100).optional().allow("", null),
  validEdition: Joi.string().max(100).optional().allow("", null),
  validItem: Joi.string().max(100).optional().allow("", null),
  validPrice: Joi.number().min(0).precision(2).optional().allow(null),
  validDate: Joi.date().iso().optional().allow(null),
  issuedQnty: Joi.number().integer().min(0).optional().allow(null),
  receivedQnty: Joi.number().integer().min(0).optional().allow(null),
  userQnty: Joi.number().integer().min(0).optional().allow(null),
  createdBy: Joi.number().integer().optional(),
});

export const updateCouponCodeSchema = Joi.object({
  name: Joi.string().max(100).optional().allow("", null),
  description: Joi.string().optional().allow("", null),
  termsConditions: Joi.string().optional().allow("", null),
  validCategory: Joi.string().max(100).optional().allow("", null),
  validBrand: Joi.string().max(100).optional().allow("", null),
  validEdition: Joi.string().max(100).optional().allow("", null),
  validItem: Joi.string().max(100).optional().allow("", null),
  validPrice: Joi.number().min(0).precision(2).optional().allow(null),
  validDate: Joi.date().iso().optional().allow(null),
  issuedQnty: Joi.number().integer().min(0).optional().allow(null),
  receivedQnty: Joi.number().integer().min(0).optional().allow(null),
  userQnty: Joi.number().integer().min(0).optional().allow(null),
  updatedBy: Joi.number().integer().optional(),
});

// --- User Address Schemas ---
export const createUserAddressSchema = Joi.object({
  userId: Joi.number().integer().optional(),
  address: Joi.string().optional().allow("", null),
  townCity: Joi.string().max(100).optional().allow("", null),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": "Pin code must be a valid 6-digit number.",
    }),
  receiversName: Joi.string().max(150).optional().allow("", null),
  receiversNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base":
        "Receiver's number must be a valid 10-digit mobile number.",
    }),
  saveAs: Joi.string()
    .valid("Home", "Work", "Other")
    .optional()
    .allow("", null),
  state: Joi.string().max(100).optional().allow("", null),
  isDefault: Joi.boolean().optional(),
  createdBy: Joi.number().integer().optional(),
});

export const updateUserAddressSchema = Joi.object({
  userId: Joi.number().integer().optional(),
  address: Joi.string().optional().allow("", null),
  townCity: Joi.string().max(100).optional().allow("", null),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": "Pin code must be a valid 6-digit number.",
    }),
  receiversName: Joi.string().max(150).optional().allow("", null),
  receiversNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base":
        "Receiver's number must be a valid 10-digit mobile number.",
    }),
  saveAs: Joi.string()
    .valid("Home", "Work", "Other")
    .optional()
    .allow("", null),
  state: Joi.string().max(100).optional().allow("", null),
  isDefault: Joi.boolean().optional(),
  updatedBy: Joi.number().integer().optional(),
});

// --- Product Rating Schemas ---
export const createProductRatingSchema = Joi.object({
  productId: Joi.number().integer().optional(),
  totalRatings: Joi.number().integer().min(0).optional(),
  givenRatings: Joi.number().integer().min(1).max(5).optional(),
  message: Joi.string().optional().allow("", null),
  reviewImages: Joi.array().items(Joi.string()).optional(),
  createdBy: Joi.number().integer().optional(),
});

export const updateProductRatingSchema = Joi.object({
  productId: Joi.number().integer().optional(),
  totalRatings: Joi.number().integer().min(0).optional(),
  givenRatings: Joi.number().integer().min(1).max(5).optional(),
  message: Joi.string().optional().allow("", null),
  reviewImages: Joi.array().items(Joi.string()).optional(),
  updatedBy: Joi.number().integer().optional(),
});

export const productFilterSchema = Joi.object({
  q: Joi.string().optional().allow("", null),
  slugs: Joi.string().optional().allow("", null),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  categoryId: Joi.number().integer().optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  cursor: Joi.number().integer().optional(),
});
