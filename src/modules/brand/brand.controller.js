import { nanoid } from "nanoid";
import brandModel from "../../../db/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
//==================================== createBrand ===================================================

export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brandExist = await brandModel.findOne({
    name: name.toLowerCase(),
  });
  if (brandExist) {
    return next(new AppError("brand already exist", 409));
  }

  if (!req.file) return next(new AppError("image is required", 404));

  const customId = nanoid(5);

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/Brands/${customId}`,
    }
  );

  const brand = await brandModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { public_id, secure_url },
    customId,
    createdBy: req.user._id,
  });
  res.status(201).json({ msg: "done", brand });
});
