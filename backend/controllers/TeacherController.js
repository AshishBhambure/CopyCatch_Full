import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find teacher by email
    const teacher = await User.findOne({ email, role: 'teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
console.log('Teacher doc found:', teacher);

    // 2️⃣ Compare password
    const match = await bcrypt.compare(password, teacher.password); // ✅ pass both arguments
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, teacherId: teacher._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getSubjectsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    console.log("TeacherId param:", teacherId);
    const subjects = await Subject.find({ teacherId });
    console.log("Found subjects:", subjects);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get submissions for an assignment
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
                .populate('studentId', 'name email');
            res.status(200).json(submissions);
  } catch(err){ res.status(500).json({ error: err.message }); }
};


// ✅ Get teacher profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id).select("-password");
    if (!teacher) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ teacher });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};