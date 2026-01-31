import axios from 'axios';
import Submission from '../models/Submission.js';
import { pythonBackendUrl } from '../pythonBackendUrl.js';

// Assignment submission by student
export const createSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    console.log("AssignmentId in body:", assignmentId);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file.path; // Cloudinary URL

    const newSub = await Submission.create({
      assignmentId,
      studentId: req.user._id,  // comes from auth middleware
      submissionLink: file,     // ✅ match schema field
    });


    let file_url = newSub.submissionLink;
    let submission_id = newSub._id;
    let assignment_id = newSub.assignmentId;



    // ======================HARDCODED ALERT ===============================================================
    try {
      console.log("Sending File to Python Backend")
    // const response = await axios.post('http://127.0.0.1:8000/upload/', null, {
    //   params: {
    //     file_url: file_url,
    //     submission_id: submission_id,
    //     assignment_id: assignment_id
    //   }
    // });
    const response = await axios.post(
  'http://127.0.0.1:8000/upload/',
  {
    file_url: file_url,
    submission_id: submission_id,
    assignment_id: assignment_id
  },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
    console.log(" Return From Pythin Backend " , file_url ,submission_id , assignmentId);
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }



    res.status(201).json({
      message: 'Submission uploaded successfully',
      submission: newSub
    });
  } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Assignment submission by student




// ✅ Update Submission
export const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId);

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    if (submission.studentId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    if (!req.file?.path)
      return res.status(400).json({ message: "File required for update." });

    submission.submissionLink = req.file.path;
    submission.updatedAt = new Date();
    await submission.save();

    res.status(200).json({ message: "Submission updated successfully", submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Submission
export const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId);

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    if (submission.studentId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await Submission.findByIdAndDelete(submissionId);
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get submission fro particular assignment by student
export const getSubmissionByAssignmentAndStudent = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user._id;

    const submission = await Submission.findOne({ assignmentId, studentId });
    console.log(assignmentId, studentId);

    console.log("Fetched submission:", submission);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get submissions for an assignment
export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json(submission);
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};