import axios from "axios";
import { ObjectId } from "mongodb";

// Get all reports for an assignment
export const getReportsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const reports = await SimilarityReport.find({ assignmentId })
      .populate("submissionId", "studentId submissionLink")
      .populate("plagiarisedWith.submissionId", "studentId submissionLink");

    res.status(200).json(reports);
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};


//  New =================================================================================
import { MongoClient } from "mongodb";
import Submission from "../models/Submission.js";
import PreProcessing from "../models/Preprocess.js";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
await client.connect();


const db = client.db("your_database_name");
const similarityReportCollection = db.collection("SimilarityReport");

// Example: Fetch a report by submission_id
// export const getSimilarityReportBySubmission = async (req, res) => {
//   try { 
//     let { submissionId } = req.params;
//       // ======================HARDCODED ALERT ===============================================================
//     let pythonBackendUrl  = "http://127.0.0.1:8000/get_similarity_report";
//     let response = await axios.get(`${pythonBackendUrl}/${submissionId}`);
//     console.log("Response from Python backend:", response.data);  
//     let report = response.data;
//     if (!report) {
//       return res.status(404).json({ message: "No similarity report found for this submission" });
//     } 
//     res.status(200).json(report);
//   } catch (err) {
//     console.error("Error fetching report:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



// import Submission from "../models/submission.model.js";

export const getSimilarityReportBySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // 1) CALL PYTHON BACKEND
    const pythonBackendUrl = "http://127.0.0.1:8000/get_similarity_report";
    const response = await axios.get(`${pythonBackendUrl}/${submissionId}`);

    let report = response.data;
    if (!report) {
      return res.status(404).json({ message: "No similarity report found" });
    }

    // 2) Enrich each doc with student name from Mongo
    const enriched = await Promise.all(
      report.plagarized_with.map(async (item) => {
        const sub = await Submission.findById(item.submission_id)
          .populate("studentId", "name"); // only return name
        return {
          ...item,
          studentName: sub?.studentId?.name || "Unknown"
        };
      })
    );

    // 3) Return same shape but enriched
    report.plagarized_with = enriched;
    return res.status(200).json(report);

  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



// export const getEnhancedSimilarityReport = async (req, res) => {
//   try {
//     const { submissionId } = req.params;
//     let pythonBackendUrl  = "http://127.0.0.1:8000/get_similarity_report";

//     // Call Python backend for similarity
//     const response = await axios.get(`${pythonBackendUrl}/${submissionId}`);
//     const report = response.data;

//     if (!report) return res.status(404).json({ message: "No report found" });

//     // Original submission info
//     // consoloe.log("Report received:", report);
//     const originalSubmission = await Submission.findById(report.submission_id)
//       .populate("assignmentId", "title")
//       .populate("studentId", "name prn");

//     // Enhance plagiarized submissions
//     const enhancedPlag = await Promise.all(
//       report.plagarized_with.map(async (item) => {
//         const sub = await Submission.findById(item.submission_id)
//           .populate("studentId", "name prn");
//         return {
//           ...item,
//           student: sub.studentId,
//           submissionLink: sub.submissionLink
//         };
//       })
//     );

//     res.status(200).json({
//       ...report,
//       assignment_title: originalSubmission.assignmentId.title,
//       originalSubmission: {
//         ...originalSubmission.toObject(),
//         student: originalSubmission.studentId
//       },
//       plagarized_with: enhancedPlag
//     });
//   } catch (err) {
//     console.error("Error fetching enhanced report:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


import Assignment from "../models/Assignment.js";

export const getSimilarityReport = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // 🔹 1. Call Python FastAPI to get similarity report
    const pythonUrl = `http://127.0.0.1:8000/get_similarity_report/${submissionId}`;
    const { data: report } = await axios.get(pythonUrl);

    if (!report) {
      return res.status(404).json({ message: "No report found from Python service" });
    }

    console.log("📘 Report received from Python:", report);

    // 🔹 2. Fetch ORIGINAL submission
    const original = await Submission.findById(report.submission_id)
      .populate("assignmentId", "title")
      .populate("studentId", "name email prn");

    if (!original) {
      return res.status(404).json({ message: "Original submission not found" });
    }

    // 🔹 2a. Fetch raw text for original submission
    const originalPre = await PreProcessing.findOne({
      submission_id: new ObjectId(report.submission_id),
    });

    const originalRawText = originalPre?.raw_text || "";

    // 🔹 3. Fetch all matched submissions + their details
    const matchedData = await Promise.all(
      (report.plagarized_with || []).map(async (match) => {
        try {
          // Fetch matched submission details
          const matchedSub = await Submission.findById(match.submission_id)
            .populate("studentId", "name email prn");

          // Fetch raw text for each matched submission
          const matchedPre = await PreProcessing.findOne({
            submission_id: new ObjectId(match.submission_id),
          });

          return {
            matchedSubmissionId: matchedSub?._id,
            similarity_score: match.similarity_score * 100 || 0,
            matched_chunks: match.matched_chunks || [],
            student: matchedSub?.studentId
              ? {
                  name: matchedSub.studentId.name,
                  email: matchedSub.studentId.email,
                  prn: matchedSub.studentId.prn,
                }
              : null,
            pdfUrl: matchedSub?.submissionLink || null,
            rawText: matchedPre?.raw_text || "", // ✅ matched submission raw text
          };
        } catch (err) {
          console.error("Error fetching matched submission details:", err.message);
          return null;
        }
      })
    );

    // 🔹 4. Get assignment title
    const assignment = await Assignment.findById(original.assignmentId);
    const assignmentTitle = assignment?.assignmentTitle || "Unknown Assignment";

    // 🔹 5. Respond with complete structure
    res.status(200).json({
      submission_id: report.submission_id,
      assignment_id: report.assignment_id,
      assignmentTitle,
      similarity_percent: report.similarity_percent || 0,
      originalSubmission: {
        student: {
          name: original.studentId?.name,
          email: original.studentId?.email,
          prn: original.studentId?.prn,
        },
        pdfUrl: original.submissionLink,
        rawText: originalRawText, // ✅ included
      },
      matchedSubmissions: matchedData.filter(Boolean), // ✅ all matched submissions with raw text
    });
  } catch (err) {
    console.error("❌ Error fetching similarity report:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
