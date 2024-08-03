import joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createOrder = {
  body: joi
    .object({
      productId: generalFiled.id,
      quantity: joi.number().integer(),
      address: joi.string().required(),
      phone: joi.string().required(),
      couponCode: joi.string().min(3),
      paymentMethod: joi.string().valid("card", "cash").required(),
    })
    .required(),

  headers: generalFiled.headers.required(),
};
