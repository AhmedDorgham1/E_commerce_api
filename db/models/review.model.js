import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment is required .."],
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "amount is required"],
      min: 1,
      max: 5,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const reviewModel = mongoose.model("review", reviewSchema);

export default reviewModel;
