import express from "express";
import dotenv from "dotenv"
dotenv.config();
import { connectDB } from "./config/db.js";
import userrouter from "./routes/user.routes.js";
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());
connectDB();


app.use("/api/auth",userrouter)
app.get("/",(req,res)=>{
    res.send("API OK");
});
const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`app is listen ${PORT}`);
})