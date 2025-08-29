import User from "../models/user.model.js";
import otpgenerate from "otp-generator"
import sendEmail from "../utils/sendEmail.js";

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
   const otp=otpgenerate.generate(6,{
    digits:true,
    alphabets: false,
    upperCase: false,
    specialChars: false,

   })
 // save user model otp
   user.otp=otp;

   // expire otp in 5 minutes
   
 user.otpExpiry=Date.now()+5*60*1000;

 await user.save()

 // send otp on gmail

 await sendEmail(email,"Your otp code",`The OTP is: ${otp}`)

 res.status(200).json({
    message:"OTP send to email. Please verify to complete signup"
 })

  } catch (err) {
    console.log(err);
    return res.status(500).json(`error in sinup ${err}`);
  }
};
