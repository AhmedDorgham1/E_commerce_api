import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required .."],
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required .."],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required .."],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    phone: {
      type: [String],
    },
    address: {
      type: [String],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.user,
    },
    code: String,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
