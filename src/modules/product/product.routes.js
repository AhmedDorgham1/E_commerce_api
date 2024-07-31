import express from "express";
import * as PC from "./product.controller.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as SCV from "./product.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const productRouter = express.Router({ mergeParams: true });

productRouter.post(
  "/",
  multerHost(validExtensions.image).fields([
    { name: "image", maxCount: 1 }, //[{}]
    { name: "coverImages", maxCount: 3 }, //[{}]
  ]),
  validation(SCV.createProduct),
  auth(["admin"]),
  PC.createProduct
);

export default productRouter;
