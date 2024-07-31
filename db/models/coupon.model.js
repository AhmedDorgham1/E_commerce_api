import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "name is required .."],
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: 1,
      max: 100,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    usedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    fromDate: {
      type: Date,
      required: [true, "fromDate is required"],
    },
    toDate: {
      type: Date,
      required: [true, "toDate is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const couponModel = mongoose.model("coupon", couponSchema);

export default couponModel;
