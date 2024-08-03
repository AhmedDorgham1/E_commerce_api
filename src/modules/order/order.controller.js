import cartModel from "../../../db/models/cart.model.js";
import couponModel from "../../../db/models/coupon.model.js";
import orderModel from "../../../db/models/order.model.js";
import productModel from "../../../db/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import slugify from "slugify";
//==================================== createOrder ===================================================

export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body;

  if (couponCode) {
    const coupon = await couponModel.findOne({ code: couponCode.toLowerCase() });
    if (!coupon || coupon.toDate < Date.now()) return next(new AppError("coupon not exist or expired", 404));
    req.body.coupon = coupon;
  }

  let products = [];
  let flag = false;
  if (productId) {
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart.products.length) {
      return next(new AppError("cart is empty please select product", 404));
    }
    products = cart.products; //BSON
    flag = true;
  }
  let finalProducts = [];
  let subPrice = 0;
  for (let product of products) {
    const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
    if (!checkProduct) {
      return next(new AppError("product not exist or out of stock", 404));
    }
    if (flag) {
      product = product.toObject();
    }
    product.title = checkProduct.title;
    product.price = checkProduct.price;
    product.finalPrice = checkProduct.subPrice;

    subPrice += product.finalPrice;

    finalProducts.push(product);
  }

  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    subPrice,
    couponId: req.body?.coupon?._id,
    totalPrice: subPrice - subPrice * ((req.body.coupon?.amount || 0) / 100),
    paymentMethod,
    status: paymentMethod === "cash" ? "placed" : "waitPayment",
    phone,
    address,
  });

  res.status(201).json({ msg: "done", order });
});
