import joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createSubCategory = {
  body: joi
    .object({
      name: joi.string().min(3).max(30).required(),
      // category: generalFiled.id.required(),
    })
    .required(),

  file: generalFiled.file.required(),
  headers: generalFiled.headers.required(),
  params: joi.object({
    categoryId: generalFiled.id.required(),
  }),
};
