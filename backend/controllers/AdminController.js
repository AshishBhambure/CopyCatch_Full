import User from '../models/User.js';
import Subject from '../models/Subject.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// =======================
// ✅ Admin Signup
// =======================
export const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingAdmin = await User.findOne({ email, role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({
            name,
            email,
            password, // Store plain password for now; will be hashed in pre-save hook
            role: 'admin',
        });

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Admin account created successfully',
            token,
            admin: { id: admin._id, name: admin.name, email: admin.email },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =======================
// ✅ Admin Login
// =======================
export const adminLogin = async (req, res) => {
    try {
        console.log("Admin login attempt with body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        console.log("Trying login for:", email);
        console.log("Stored hash:", admin.password);

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            adminId: admin._id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =======================
// ✅ Create Teacher
// =======================
export const createTeacher = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingTeacher = await User.findOne({ email, role: 'teacher' });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher with this email already exists' });
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const teacher = await User.create({
            name,
            email,
            password, // Store plain password for now; will be hashed in pre-save hook
            mobile,
            role: 'teacher',
        });

        res.status(201).json({ message: 'Teacher created successfully', teacher });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =======================
// ✅ Get all Teachers
// =======================
export const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =======================
// ✅ Create Subject & assign teacher
// =======================
export const createSubject = async (req, res) => {
    try {
        const { subjectName, courseCode, teacherId, department, year } = req.body;

        if (!subjectName || !courseCode || !teacherId || !department || !year) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const subject = await Subject.create({
            subjectName,
            courseCode,
            teacherId,
            department,
            year,
        });

        res.status(201).json({ message: 'Subject created successfully', subject });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =======================
// ✅ Get all Subjects
// =======================
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teacherId', 'name email');
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// =======================
// ✅ Update Teacher
// =======================
export const updateTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const updates = req.body; // name, email, mobile, password allowed

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const teacher = await User.findOneAndUpdate(
            { _id: teacherId, role: 'teacher' },
            updates,
            { new: true }
        ).select('-password');

        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        res.status(200).json({ message: "Teacher updated successfully", teacher });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// =======================
// ✅ Delete Teacher
// =======================
export const deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await User.findOneAndDelete({ _id: teacherId, role: 'teacher' });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// =======================
// ✅ Update Subject
// =======================
export const updateSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const updates = req.body; // subjectName, courseCode, teacherId, etc.

        const subject = await Subject.findByIdAndUpdate(subjectId, updates, { new: true });
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        res.status(200).json({ message: "Subject updated successfully", subject });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// =======================
// ✅ Delete Subject
// =======================
export const deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findByIdAndDelete(subjectId);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
