import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
export const mailSender = async (email,title,body)=>{    
try{
    // require('dotenv').config();
    console.log("User Form Env :: ",process.env.MAIL_USER);
    console.log("Pass : ", process.env.MAIL_PASS);
    let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
    })

    let info = await transporter.sendMail(
        {
            from:'Copycatch-Support' ,
            to:email ,
            subject:title ,
            html:`
            <h1> Otp for Verification </h1>
            <h2>  ${body} </h2>
            ` ,
            
            

        }

    )
    console.log(" Mail Info-->" , info);
    return info;
}
catch(e){
    console.log(e);
}
}

// module.exports = mailSender;