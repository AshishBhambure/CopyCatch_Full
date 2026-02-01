import mongoose from 'mongoose';
import { mailSender } from '../utils/mailSender.js';


const otpSchema = new mongoose.Schema({
     email:{
        type:String,
        required:true,
     },
     otp:{
        type:String,
        required:true,
     },
     createdAt:{
        type:Date,
        default:Date.now,
        expires:8*60,
     },

});

async function sendVerificationEmail(email,otp){
    try{
       const emailResponse = await mailSender(email,"Verification Email from CopyCatch  ",otp );
       console.log(" E-mail Sent SuccessFully !! " , emailResponse)
    }
    catch(e){
        console.log("Error in otp module While Sending The MAil -- > " , e)
    }

}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


export default mongoose.model("Otp",otpSchema);