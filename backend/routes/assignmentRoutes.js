import express from 'express';
import { createAssignment, deleteAssignment, updateAssignment,getAssignmentsBySubject, getSubmissionsByAssignment, getAssignmentById } from "../controllers/AssignmentController.js";
import { auth, requireRole } from '../middleware/authMiddleware.js';
// import upload from '../config/cloudinary.js'; // the multer setup above
import storage from '../config/cloudinary.js';
import multer from 'multer';
// import { getSubmissionsByAssignment } from '../controllers/TeacherController.js';

const upload = multer({ storage });
const router = express.Router();

router.post(
  '/create',
  auth,
  requireRole(['teacher']),
  upload.single('file'), 
  createAssignment
);


// router.post("/assignments", auth, upload.single("questionPaperLink"), createAssignment);

router.post(
  '/:id',
  auth,
  requireRole(['teacher']),
  upload.single('file'), // optional for updating question paper
  updateAssignment
);

router.delete(
  '/:id',
  auth,
  requireRole(['teacher']),
  deleteAssignment
);

router.get('/subject/:subjectId/assignments', auth, getAssignmentsBySubject);
// router.get('/subject/:subjectId/', auth, getAssignmentById);
router.get('/:assignmentId', getAssignmentById); 

router.get('/assignment/:assignmentId/submissions', auth, requireRole('teacher'), getSubmissionsByAssignment);





export default router;
