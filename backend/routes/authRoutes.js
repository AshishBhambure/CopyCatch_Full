import express from 'express';
import { teacherLogin } from '../controllers/TeacherController.js';
import { adminLogin } from '../controllers/AdminController.js';
import { studentLogin } from '../controllers/StudentController.js';
import { sendOtp, verifyOtp } from '../controllers/authController.js';
// import { verify } from 'jsonwebtoken';

const router = express.Router();

// router.post('/login', studentLogin);
// router.post('/login', teacherLogin);
// router.post('/login', adminLogin);

router.post('/sendOtp',sendOtp);
router.post('/verifyOtp',verifyOtp)

export default router;
