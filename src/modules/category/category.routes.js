import subCategoryRouter from "./../subCategory/subCategory.routes.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import * as CC from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "./category.validation.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter);

categoryRouter.post(
  "/",
  multerHost(validExtensions.image).single("image"),
  validation(CV.createCategory),
  auth(["admin"]),
  CC.createCategory
);
categoryRouter.put(
  "/:id",
  multerHost(validExtensions.image).single("image"),
  validation(CV.updateCategory),
  auth(["admin"]),
  CC.updateCategory
);

categoryRouter.get(
  "/",
  // auth(Object.values(systemRoles)),
  CC.getCategories
);

categoryRouter.delete("/:id", auth(Object.values(systemRoles)), CC.deleteCategory);

export default categoryRouter;
