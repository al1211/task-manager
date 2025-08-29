import User from "../models/user.model.js";
import otpgenerate from "otp-generator";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const userSingup = async (req, res) => {
  try {
    // get name and email
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // already user register
    const exituser = await User.findOne({ email });
    if (exituser) {
      return res.status(400).json({ message: "This is already use" });
    }

    let user = new User({
      name,
      email,
    });

    //  generate otp
    const otp = otpgenerate.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    // save user model otp
    user.otp = otp;

    // expire otp in 5 minutes

    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // send otp on gmail

    await sendEmail(email, "Your otp code", `The OTP is: ${otp}`);

    res.status(200).json({
      message: "OTP send to email. Please verify to complete signup",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(`error in sinup ${err}`);
  }
};

export const userLogin=async(req,res)=>{
  try {
    const {email}=req.body;
    if(!email){
      return res.status(400).json({message:"Email required"});
    };

    const exituser=await User.findOne({email});
    if(!exituser){
      return res.status(400).json({message:"User no found"})
    };
    const otp=otpgenerate.generate(6,{
        digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    exituser.otp=otp;
    exituser.otpExpiry=Date.now()+5*60*1000;
    await exituser.save();

    await sendEmail(email, "Your otp code", `The OTP is: ${otp}`);

     res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message:`Error in login user ${err}`})
  }
}



// verification ot otp
export const userVerificationOtp = async (req, res) => {
  try {
    // get email and otp from user
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and otp is valid" });
    }
    
    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // verification otp
    console.log(`${user.otp} and ${otp}`)
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expire otp" });
    }

    // otp clear
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({message:"singup sussesfull",    user: { id: user._id, name: user.name, email: user.email }})
  } catch (err) {
    console.log(err);
    return res.status(500).json(`error in verification ${err}`);
  }
};
