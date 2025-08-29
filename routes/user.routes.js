import express from "express";
import { userLogin, userSingup, userVerificationOtp } from "../controllers/user.controller.js";

const userrouter=express.Router();

userrouter.post("/signup",userSingup);
userrouter.post("/login",userLogin)
userrouter.post("/verify",userVerificationOtp)


export default userrouter;