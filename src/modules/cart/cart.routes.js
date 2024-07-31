import express from "express";
import * as CC from "./cart.controller.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "./cart.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const cartRouter = express.Router();

cartRouter.post("/", validation(CV.createCart), auth(Object.values(systemRoles)), CC.createCart);
cartRouter.patch("/", validation(CV.removeFromCart), auth(Object.values(systemRoles)), CC.removeFromCart);
cartRouter.put("/", validation(CV.clearCart), auth(Object.values(systemRoles)), CC.clearCart);

export default cartRouter;
