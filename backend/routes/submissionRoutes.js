import express from 'express';
import multer from 'multer';
import { createSubmission, getSubmissionByAssignmentAndStudent, getSubmissionById, getSubmissionsByAssignment } from '../controllers/SubmissionController.js';
import { auth, requireRole } from '../middleware/authMiddleware.js';
import storage from '../config/cloudinary.js'; // ✅ Cloudinary storage setup
import { deleteSubmission, getStudentBySubmissionId, updateSubmission } from '../controllers/StudentController.js';

const upload = multer({ storage });
const router = express.Router();

// Student submits assignment
router.post(
  '/submit',
  auth,
  requireRole(['student']),   // only students can submit
  upload.single('file'),      // file key = "file"
  createSubmission
);

router.post('/:submissionId', auth, 
requireRole('student'), 
  upload.single('file'),  // <-- add this
updateSubmission);

router.delete('/:submissionId', auth, requireRole('student'), deleteSubmission);
// getSubmissionByAssignmentAndStudent
router.get('/:assignmentId/submission', auth, requireRole('student'), getSubmissionByAssignmentAndStudent);
router.get("/:id", getSubmissionById);

router.get("/:id/student", getStudentBySubmissionId)

// router.get('/:assignmentId/submission', auth, requireRole('student'), getSubmissionsByAssignment);
export default router;
