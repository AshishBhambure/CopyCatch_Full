// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();
// export const mailSender = async (email,title,body)=>{    
// try{
//     // require('dotenv').config();
//     console.log("Host : ",process.env.MAIL_HOST,)
//     console.log("User Form Env :: ",process.env.MAIL_USER);
//     console.log("Pass : ", process.env.MAIL_PASS);
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//       port: 465,
//       secure: true, 
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       connectionTimeout: 10000,
//     })

//     let info = await transporter.sendMail(
//         {
//             from:'Copycatch-Support' ,
//             to:email ,
//             subject:title ,
//             html:`
//             <h1> Otp for Verification </h1>
//             <h2>  ${body} </h2>
//             ` 
//         }
//     )
//     console.log(" Mail Info-->" , info);
//     return info;
// }
// catch(e){
//     console.log(e);
// }
// }

// // module.exports = mailSender;

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
export const mailSender = async (email, title, body) => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS:", process.env.MAIL_PASS ? "Loaded" : "Missing");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // REQUIRED for 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000, // 10 sec
    });

    // ✅ Verify connection (VERY IMPORTANT on Render)
    await transporter.verify();
    console.log("SMTP server is ready to send emails");

    const info = await transporter.sendMail({
      from: `"CopyCatch Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>OTP for Verification</h2>
          <p>Your OTP is:</p>
          <h1>${body}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;

  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const mailSender = async (email, title, body) => {
//     console.log(process.env.RESEND_API_KEY);
//   return await resend.emails.send({
//     from: "CopyCatch <onboarding@resend.dev>",
//     to: email,
//     subject: title,
//     html: `
//       <h2>OTP Verification</h2>
//       <h1>${body}</h1>
//     `,
//   });
// };

