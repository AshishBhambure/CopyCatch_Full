import express from 'express';
import {
  adminSignup,
  adminLogin,
  createTeacher,
  getTeachers,
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  deleteTeacher,
  updateTeacher
} from '../controllers/AdminController.js';
import { auth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/signup', adminSignup);
router.post('/login', adminLogin);

// Protected routes
router.post('/teacher/create', auth, requireRole('admin'), createTeacher);
router.get('/teacher/all', auth, requireRole('admin'), getTeachers);

router.post('/subject/create', auth, requireRole('admin'), createSubject);
router.get('/subject/all', auth, requireRole('admin'), getSubjects);

// Teacher Update & Delete
router.post('/teacher/update/:teacherId', auth, requireRole('admin'), updateTeacher);
router.delete('/teacher/delete/:teacherId', auth, requireRole('admin'), deleteTeacher);

// Subject Update & Delete
router.post('/subject/update/:subjectId', auth, requireRole('admin'), updateSubject);
router.delete('/subject/delete/:subjectId', auth, requireRole('admin'), deleteSubject);

export default router;
