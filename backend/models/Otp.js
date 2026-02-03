import mongoose from 'mongoose';
import { mailSender } from '../utils/mailSender.js';
import axios from 'axios';
import Subject from './Subject.js';
import { text } from 'express';

const otpSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
   },
   otp: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
      expires: 8 * 60,
   },

});

async function sendVerificationEmail(email, otp) {
   const URL_FOR_SEND_OTP = process.env.URL_FOR_SEND_OTP;
   try {
      console.log("Seding Email and Trying to reach GCP !!");
      let reply = await axios.post(URL_FOR_SEND_OTP, {
         to: email,
         subject: "Verifaction email from CopyCatch",
         text: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px;">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          
          <tr>
            <td align="center">
              <h2 style="color:#222; margin-bottom:10px;">Email Verification</h2>
              <p style="color:#555; font-size:14px;">
                Use the OTP below to verify your email address on  
                <strong>CopyCatch</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <div
                style="
                  font-size:28px;
                  font-weight:bold;
                  letter-spacing:6px;
                  color:#2d6cdf;
                  padding:15px 25px;
                  border:1px dashed #2d6cdf;
                  border-radius:6px;
                  display:inline-block;
                  user-select:all;
                "
              >
                ${otp}
              </div>
            </td>
          </tr>

         

          <tr>
            <td>
              <hr style="border:none; border-top:1px solid #eee;" />
              <p style="font-size:12px; color:#777; text-align:center; margin-top:15px;">
                This OTP is valid for <strong>10 minutes</strong>.  
                Do not share it with anyone.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`
      });

      console.log("Email Sent successfully !", reply.data);
      //  const emailResponse = await mailSender(email,"Verification Email from CopyCatch  ",otp );
      //  console.log(" E-mail Sent SuccessFully !! " , emailResponse)
   }
   catch (e) {
      console.log("Error in otp module While Sending The MAil -- > ", e)
   }

}

otpSchema.pre("save", async function (next) {
   await sendVerificationEmail(this.email, this.otp);
   next();
})


export default mongoose.model("Otp", otpSchema);