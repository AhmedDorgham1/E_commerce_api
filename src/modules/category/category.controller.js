import { nanoid } from "nanoid";
import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";
//==================================== createCategory ===================================================

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (categoryExist) {
    return next(new AppError("category already exist", 409));
  }

  if (!req.file) return next(new AppError("image is required", 404));

  const customId = nanoid(5);

  const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/categories/${customId}`,
  });

  const category = await categoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { public_id, secure_url },
    customId,
    createdBy: req.user._id,
  });
  res.status(201).json({ msg: "done", category });
});
//==================================== updateCategory ===================================================

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await categoryModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category) {
    return next(new AppError("category not exist", 404));
  }

  if (name) {
    if (name.toLowerCase() === category.name) return next(new AppError("name should be different", 400));
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("name already exist", 409));
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/categories/${category.customId}`,
    });
    category.image = { secure_url, public_id };
  }
  await category.save();
  res.status(200).json({ msg: "done", category });
});

//==================================== getCategories ===================================================
//we need to get categories and their subCategories
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find().populate("subCategories");
  // let list = [];
  // for (const category of categories) {
  //   const subCategories = await subCategoryModel.find({ category: category._id });
  //   const newCategory = category.toObject();
  //   newCategory.subCategories = subCategories;
  //   list.push(newCategory);
  // }

  res.status(200).json({ msg: "done", categories });
});

//==================================== deleteCategory ===================================================
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndDelete({ _id: id, createdBy: req.user._id });
  if (!category) {
    return next(new AppError("category not exist or you do not have permission", 401));
  }

  //delete subCategories that related to category
  await subCategoryModel.deleteMany({ category: category._id });

  //delete from cloudinary
  //we should remove all images and resources before deleting folder
  await cloudinary.api.delete_resources_by_prefix(`Ecommerce/categories/${category.customId}`);
  await cloudinary.api.delete_folder(`Ecommerce/categories/${category.customId}`);

  res.status(200).json({ msg: "done" });
});
