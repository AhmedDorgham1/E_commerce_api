import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const wishListModel = mongoose.model("wishList", wishListSchema);

export default wishListModel;
