import express from "express";
import * as OC from "./order.controller.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as OV from "./order.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const orderRouter = express.Router();

orderRouter.post("/", validation(OV.createOrder), auth(Object.values(systemRoles)), OC.createOrder);

export default orderRouter;
