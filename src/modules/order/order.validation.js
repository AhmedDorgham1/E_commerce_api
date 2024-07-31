import joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createOrder = {
  body: joi
    .object({
      productId: generalFiled.id.required(),
      quantity: joi.number().integer().required(),
    })
    .required(),

  headers: generalFiled.headers.required(),
};
