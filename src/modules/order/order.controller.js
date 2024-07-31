import orderModel from "../../../db/models/order.model.js";
import productModel from "../../../db/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import slugify from "slugify";
//==================================== createOrder ===================================================

export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } });
  if (!product) {
    return next(new AppError("product not exist or out of stock"));
  }

  const orderExist = await orderModel.findOne({ user: req.user._id });
  if (!orderExist) {
    const order = await orderModel.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
    return res.status(201).json({ msg: "done", order });
  }
  let flag = false;

  for (const product of orderExist.products) {
    if (productId == product.productId) {
      product.quantity = quantity;
      flag = true;
    }
  }
  if (!flag) {
    orderExist.products.push({
      productId,
      quantity,
    });
  }

  await orderExist.save();
  res.status(201).json({ msg: "done", order: orderExist });
});
