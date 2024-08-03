import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        title: { type: String, required: true },
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    //subPrice is the price of products after applying the discount on each product
    subPrice: { type: Number, required: true },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    },
    //totalPrice is the price after applying the coupon
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ["card", "cash"] },
    status: {
      type: String,
      enum: ["placed", "waitPayment", "delivered", "onWay", "cancelled", "rejected"],
      default: "placed",
    },
    cancelledBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    reason: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
