// / controllers/StudentController.js
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Submission from '../models/Submission.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Assignment from '../models/Assignment.js';


// Student Signup
export const studentSignup = async (req, res) => {
  try {
    const { name, email, password, mobile, prn } = req.body;

    if (!name || !email || !password || !prn) 
      return res.status(400).json({ message: 'All fields are required' });

    const existingStudent = await User.findOne({ email, role: 'student' });
    if (existingStudent) return res.status(400).json({ message: 'Student already exists' });

    const student = await User.create({
      name,
      email,
      password, // pre-save hook hashes it
      mobile,
      prn,
      role: 'student',
    });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Student created', token, studentId: student._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Student Login
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const student = await User.findOne({ email, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token, studentId: student._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// 🧾 Update Student Year
// =============================
export const updateStudentYear = async (req, res) => {
  try {
    const { year } = req.body;
    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const student = await User.findByIdAndUpdate(
      req.user._id,
      { year },
      { new: true }
    ).select("-password"); // optional - hides password field

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Year updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get student profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get subjects for student year
export const getSubjectsByYear = async (req, res) => {
  try {
    const year = req.user.year; // from logged-in student
    const subjects = await Subject.find({ year }).populate(
      'teacherId',
      'name email'
    );
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// =============================
// ✏️ Update Student Submission
// =============================
export const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
 
    // Find the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Ensure only the student who owns this submission can update
    console.log(submission.studentId.toString()," && ", req.user._id.toString())
    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this submission' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // New Cloudinary file URL
    const newFileUrl = req.file.path;

    // (Optional) Delete old file from Cloudinary if you stored its public_id
    // if (submission.cloudinaryId) {
    //   await cloudinary.uploader.destroy(submission.cloudinaryId);
    // }

    submission.submissionLink = newFileUrl;   // ✅ correct field
    submission.submittedAt = new Date();

    await submission.save();

    res.status(200).json({
      message: 'Submission updated successfully',
      submission,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// 🗑️ Delete Student Submission
// =============================
export const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Ensure submission belongs to logged-in student
    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own submission' });
    }

    // (Optional) delete old file from Cloudinary
    // if (submission.cloudinaryId) {
    //   await cloudinary.uploader.destroy(submission.cloudinaryId);
    // }

    await Submission.findByIdAndDelete(submissionId);

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssignmentsBySubjectForStudent = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const studentId = req.user._id;
console.log("SubjectId param:", subjectId);

    const assignments = await Assignment.find({subjectId});
    console.log(assignments);

    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found for this subject" });
    }

    // For each assignment, find submission by this student
    const assignmentsWithSubmission = await Promise.all(
      assignments.map(async (a) => {
        const submission = await Submission.findOne({
          assignment: a._id,
          student: studentId,
        });
        return {
          ...a,
          submissionLink: submission ? submission.submissionLink : null,
          submissionId: submission ? submission._id : null,
        };
      })
    );

    res.json(assignmentsWithSubmission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};


export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getStudentBySubmissionId = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Submission Id:", id);

    // Find submission and populate student
    const submission = await Submission.findById(id).populate("studentId");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.json({ student: submission.studentId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
