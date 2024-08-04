import express from "express";
import * as RC from "./review.controller.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as RV from "./review.validation.js";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.post("/", validation(RV.createReview), auth(["admin"]), RC.createReview);

export default reviewRouter;
