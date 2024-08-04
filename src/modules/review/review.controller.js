import orderModel from "../../../db/models/order.model.js";
import productModel from "../../../db/models/product.model.js";
import reviewModel from "../../../db/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import slugify from "slugify";
//==================================== createReview ===================================================

export const createReview = asyncHandler(async (req, res, next) => {
  const { comment, rate } = req.body;
  const { productId } = req.params;
  //check if product exist
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  //check if review exist
  const reviewExist = await reviewModel.findOne({ createdBy: req.user._id, productId });
  if (reviewExist) {
    return next(new AppError("you have already completed the review"));
  }
  //check if order exist
  const order = await orderModel.findOne({ user: req.user._id, "products.productId": productId, status: "delivered" });
  if (!order) {
    return next(new AppError("order not found", 404));
  }

  const review = await reviewModel.create({
    comment,
    rate,
    productId,
    createdBy: req.user._id,
  });

  // const reviews = await reviewModel.find({ productId });
  // let sum = 0;
  // for (const review of reviews) {
  //   sum += review.rate;
  // }
  // product.rateAvg = sum / reviews.length;

  let sum = product.rateAvg * product.rateNum;
  sum += rate;

  product.rateNum++;
  product.rateAvg = sum / product.rateNum;

  await product.save();

  res.status(201).json({ msg: "done", review });
});

//==================================== deleteReview ===================================================

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await reviewModel.findByIdAndDelete(id);
  if (!review) {
    return next(new AppError("review does not exist", 404));
  }

  const product = await productModel.findById(review.productId);

  let sum = product.rateAvg * product.rateNum;
  sum -= review.rate;

  product.rateNum--;
  product.rateAvg = sum / product.rateNum;

  await product.save();

  res.status(200).json({ msg: "done" });
});
