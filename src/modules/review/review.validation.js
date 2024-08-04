import joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createReview = {
  body: joi
    .object({
      comment: joi.string().required(),
      rate: joi.number().integer().min(1).max(5).required(),
    })
    .required(),
  params: joi.object({ productId: generalFiled.id.required() }).required(),
  headers: generalFiled.headers.required(),
};

export const deleteReview = {
  params: joi.object({ id: generalFiled.id.required() }).required(),
  headers: generalFiled.headers.required(),
};
