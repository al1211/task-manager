import express from "express";
import { userSingup } from "../controllers/user.controller.js";

const userrouter=express.Router();

userrouter.post("/signup",userSingup);


export default userrouter;