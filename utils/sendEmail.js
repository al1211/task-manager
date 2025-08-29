import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `Notes App <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("email was successfully send");
  } catch (err) {
    console.error(err);
    throw new Error("email error");
  }
};


export default sendEmail;