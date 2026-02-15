import Otp from "../models/Otp.js";
import User from '../models/User.js';
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";


export const sendOtp = async(req,res)=>{
 
    try{
       
        const {email} =req.body;

        console.log('email at bd ' ,req.body);
    
        //User Exists ? 
        const checkUserPresent = await User.findOne({email:email});
    
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Exists",
            })
        }

        var otp = otpGenerator.generate(6, {upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false, });

        console.log("Otp Genrated -->" ,otp);

        //check unique otp or not
        let result = await Otp.findOne({otp});
        while(result){
             otp = otpGenrator.generate(6,{
                upperCaseAlphabates:false,
                lowerCaseAlphabates:false,
                specialChars:false,
                });

         result = await Otp.findOne({otp});
        }

        const otpPayload = {email,otp};
        //create an entry for otp in db
        const otpBody = await Otp.create(otpPayload);

        res.status(200).json({
            success:true,
            message:"Otp Created SuccesFully !",
            otp,
        })

    }
    catch(e){
        console.log(" Errror In Otp Genration Function --> ",e);
        res.status(500).json({
            success:false,
            message:e.message,
        })
    }

};

export const sendOtpForForgotPassword = async(req,res)=>{
 
    try{
       
        const {email} =req.body;

        console.log('email at bd ' ,req.body);
    
        //User Exists ? 
        const checkUserPresent = await User.findOne({email:email});
    
        if(!checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"Your are new User Please Signup !!",
            })
        }

        var otp = otpGenerator.generate(6, {upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false, });

        console.log("Otp Genrated -->" ,otp);

        //check unique otp or not
        let result = await Otp.findOne({otp});
        while(result){
             otp = otpGenrator.generate(6,{
                upperCaseAlphabates:false,
                lowerCaseAlphabates:false,
                specialChars:false,
                });

         result = await Otp.findOne({otp});
        }

        const otpPayload = {email,otp};
        //create an entry for otp in db
        const otpBody = await Otp.create(otpPayload);

        res.status(200).json({
            success:true,
            message:"Otp Created SuccesFully !",
            otp,
        })

    }
    catch(e){
        console.log(" Errror In Otp Genration Function --> ",e);
        res.status(500).json({
            success:false,
            message:e.message,
        })
    }

};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Verify OTP req body ->", req.body);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP entry for this email
    const otpRecord = await Otp
  .findOne({ email })
  .sort({ createdAt: -1 }); 

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Compare OTP
    if (otpRecord.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified successfully
    // (optional but recommended) delete OTP after success
    await Otp.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (e) {
    console.log("Error in verifyOtp -> ", e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};



export const forgotPass = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and new password required",
      });
    }

    // check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = password;
    await user.save(); 

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user,
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

