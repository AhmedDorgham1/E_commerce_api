import joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createProduct = {
  body: joi.object({
    title: joi.string().min(3).max(30).required(),
    stock: joi.number().min(1).integer().required(),
    discount: joi.number().min(1).max(100),
    price: joi.number().min(1).integer().required(),
    brand: generalFiled.id.required(),
    subCategory: generalFiled.id.required(),
    category: generalFiled.id.required(),
    description: joi.string(),
  }),
  files: joi
    .object({
      image: joi.array().items(generalFiled.file.required()).required(),
      coverImages: joi.array().items(generalFiled.file.required()).required(),
    })
    .required(),
  headers: generalFiled.headers.required(),
};
