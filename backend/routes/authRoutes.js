import express from 'express';
import { teacherLogin } from '../controllers/TeacherController.js';
import { adminLogin } from '../controllers/AdminController.js';
import { studentLogin } from '../controllers/StudentController.js';
import { forgotPass, sendOtp, sendOtpForForgotPassword, verifyOtp } from '../controllers/authController.js';
// import { verify } from 'jsonwebtoken';

const router = express.Router();

// router.post('/login', studentLogin);
// router.post('/login', teacherLogin);
// router.post('/login', adminLogin);

router.post('/sendOtp',sendOtp);
router.post('/sendOtpForgotPass',sendOtpForForgotPassword);
router.post('/verifyOtp',verifyOtp)
router.post('/forgotPassword',forgotPass);

export default router;
