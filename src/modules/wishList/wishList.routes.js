import express from "express";
import * as WLC from "./wishList.controller.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as WLV from "./wishList.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const wishListRouter = express.Router({ mergeParams: true });

wishListRouter.post("/", validation(WLV.createWishList), auth(Object.values(systemRoles)), WLC.createWishList);

export default wishListRouter;
