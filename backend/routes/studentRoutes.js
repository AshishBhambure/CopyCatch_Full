// routes/studentRoutes.js
import express from 'express';
import { studentSignup, studentLogin, getSubjectsByYear, updateSubmission, deleteSubmission, updateStudentYear, getAssignmentsBySubjectForStudent, getStudentById, getStudentProfile } from '../controllers/StudentController.js';
import { auth, requireRole } from '../middleware/authMiddleware.js';
import storage from '../config/cloudinary.js'; // ✅ Cloudinary storage setup

import multer from 'multer';
const upload = multer({ storage });

const router = express.Router();

router.post('/signup', studentSignup);
router.post('/login', studentLogin);

// Protected route: student fetches subjects automatically by their year
router.get('/subjects', auth, requireRole(['student']), getSubjectsByYear);
// submission actions
router.get('/subject/:subjectId/assignments', auth, requireRole('student'), 
getAssignmentsBySubjectForStudent
);

// router.post('/submission/:submissionId', auth, 
// requireRole('student'), 
//   upload.single('file'),  // <-- add this
// updateSubmission);
// router.delete('/submission/:submissionId', auth, requireRole('student'), deleteSubmission);

router.post("/update-year", auth, requireRole("student"), updateStudentYear);

// ✅ Get profile
router.get("/profile", auth, getStudentProfile);
router.get("/:id", auth, getStudentById);




export default router;
