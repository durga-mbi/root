import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        qnty: Joi.number().integer().positive().required(),
        rate: Joi.number().positive().required(),
        net_amount: Joi.number().positive().required(),
      }),
    )
    .min(1)
    .required(),
  total_amount: Joi.number().positive().required(),
  discounted_amount: Joi.number().min(0).optional(),
  del_charge_amount: Joi.number().min(0).optional(),
  tax_amount_b_coins: Joi.number().min(0).optional(),
  payment_mode: Joi.string().required(),
  delivery_date: Joi.date().iso().optional(),
  coinsToRedeem: Joi.number().min(0).optional(),
});

export const cancelOrderSchema = Joi.object({
  updated_by: Joi.number().integer().positive().optional(),
  cancel_reason: Joi.string().required(),
  cancelled_by_type: Joi.string()
    .valid("user", "admin", "system", "USER", "ADMIN", "SYSTEM")
    .required(),
});
