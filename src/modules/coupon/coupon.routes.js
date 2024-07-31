import express from "express";
import * as CC from "./coupon.controller.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "./coupon.validation.js";

const couponRouter = express.Router();

couponRouter.post("/", validation(CV.createCoupon), auth(["admin"]), CC.createCoupon);
couponRouter.put("/:id", validation(CV.updateCoupon), auth(["admin"]), CC.updateCoupon);

export default couponRouter;
