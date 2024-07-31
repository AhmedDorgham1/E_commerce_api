import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import productModel from "../../../db/models/product.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import categoryModel from "../../../db/models/category.model.js";
import brandModel from "../../../db/models/brand.model.js";
//==================================== createProduct ===================================================

export const createProduct = asyncHandler(async (req, res, next) => {
  const { stock, discount, price, brand, subCategory, category, description, title } = req.body;

  // check if category exists
  const categoryExist = await categoryModel.findOne({ _id: category });
  if (!categoryExist) {
    return next(new AppError("category not exist", 404));
  }

  // check if subCategory exists
  const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
  if (!subCategoryExist) {
    return next(new AppError("subCategory not exist", 404));
  }

  // check if brand exists
  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) {
    return next(new AppError("brand not exist", 404));
  }

  // check if product exists
  const productExist = await productModel.findOne({ title: title.toLowerCase() });
  if (productExist) {
    return next(new AppError("product already exist", 404));
  }

  const subPrice = price - (price * (discount || 0)) / 100;

  if (!req.files) {
    return next(new AppError("image is required", 404));
  }
  const customId = nanoid(5);

  let list = [];

  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
      folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}`,
    });
    list.push({ secure_url, public_id });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
    folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}`,
  });

  const product = await productModel.create({
    title,
    slug: slugify(title, { lower: true, replacement: "_" }),
    description,
    price,
    discount,
    subPrice,
    stock,
    category,
    subCategory,
    brand,
    image: { secure_url, public_id },
    coverImages: list,
    customId,
    createdBy: req.user._id,
  });

  res.status(201).json({ msg: "done", product });
});
