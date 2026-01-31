import express from 'express';
import { teacherLogin } from '../controllers/TeacherController.js';
import { adminLogin } from '../controllers/AdminController.js';
import { studentLogin } from '../controllers/StudentController.js';

const router = express.Router();

// router.post('/login', studentLogin);
// router.post('/login', teacherLogin);
// router.post('/login', adminLogin);





export default router;
