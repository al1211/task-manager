import express from "express";
import { userSingup, userVerificationOtp } from "../controllers/user.controller.js";

const userrouter=express.Router();

userrouter.post("/signup",userSingup);
userrouter.post("/verify",userVerificationOtp)


export default userrouter;