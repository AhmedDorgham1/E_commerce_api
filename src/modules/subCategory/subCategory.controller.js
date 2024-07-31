import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import categoryModel from "../../../db/models/category.model.js";
//==================================== createSubCategory ===================================================

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  //req.body--> we deleted category form it and added merge params

  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) {
    return next(new AppError("category not found", 404));
  }

  const subCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (subCategoryExist) {
    return next(new AppError("subCategory already exist", 409));
  }

  if (!req.file) return next(new AppError("image is required", 404));

  const customId = nanoid(5);

  const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${customId}`,
  });

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { public_id, secure_url },
    customId,
    category: req.params.categoryId,
    createdBy: req.user._id,
  });
  res.status(201).json({ msg: "done", subCategory });
});
//==================================== updateSubCategory ===================================================
//you should do it

//==================================== getSubCategories ===================================================

export const getSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await subCategoryModel.find().populate([
    { path: "category", select: "-_id" },
    { path: "createdBy", select: "name -_id" },
  ]);

  res.status(200).json({ msg: "done", subCategories });
});
