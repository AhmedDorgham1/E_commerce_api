import express from "express";
import * as UC from "./user.controller.js";

const router = express.Router();

router.post("/signup", UC.signUp);
router.post("/signin", UC.signin);
router.get("/verifyEmail/:token", UC.verifyEmail);
router.get("/refreshToken/:refToken", UC.refreshToken);
router.patch("/sendCode", UC.forgetPassword);
router.patch("/resetPassword", UC.resetPassword);

export default router;
