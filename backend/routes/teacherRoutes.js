import express from 'express';
import { teacherLogin, getSubjectsByTeacher, getSubmissionsByAssignment, getTeacherProfile } from '../controllers/TeacherController.js';
import { auth, requireRole } from '../middleware/authMiddleware.js';
import { getSubjectById } from '../controllers/SubjectController.js';
const router = express.Router();

router.post('/login', teacherLogin);

// protected teacher endpoints
router.get('/:teacherId/subjects', auth, requireRole('teacher'), getSubjectsByTeacher);
// router.get('/subject/:subjectId/assignments', auth, requireRole('teacher'), getAssignmentsBySubject);

router.get('/assignment/:assignmentId/submissions', auth, requireRole('teacher'), getSubmissionsByAssignment);
router.get("/profile", auth, getTeacherProfile);
router.get("/subject/:id", auth, getSubjectById);

export default router;
