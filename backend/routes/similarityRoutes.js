// import express from 'express';
// import { getReportBySubmission, getReportsByAssignment } from '../controllers/SimilarityReportController.js';
// import { auth } from '../middleware/authMiddleware.js';
// const router = express.Router();

// router.get('/submission/:submissionId', auth, getReportBySubmission);
// router.get('/assignment/:assignmentId', auth, getReportsByAssignment);

// export default router;

import express from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import {
  getReportsByAssignment,
  getSimilarityReport,

  getSimilarityReportBySubmission,
} from "../controllers/SimilarityReportController.js";

const router = express.Router();

// Teacher fetches similarity report of a submission
router.get(
  "/submission/:submissionId",
  auth,
  requireRole(["teacher"]),
  getSimilarityReportBySubmission
  // getEnhancedSimilarityReport
);

// Teacher fetches all similarity reports of an assignment
router.get(
  "/assignment/:assignmentId",
  auth,
  requireRole(["teacher"]),
  getReportsByAssignment
);
router.get("/report/:submissionId", getSimilarityReport);
// router.get("/report/:submissionId", getSimilarityReportBySubmission);


export default router;
