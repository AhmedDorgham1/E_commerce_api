import mongoose from "mongoose";

const subCategory = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required .."],
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    customId: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const subCategoryModel = mongoose.model("subCategory", subCategory);

export default subCategoryModel;
