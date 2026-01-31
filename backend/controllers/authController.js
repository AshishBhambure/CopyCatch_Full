// import Student from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // export const signupStudent = async (req, res) => {
// //   try {
// //     const { name, email, password, prn, batch } = req.body;

// //     const existingEmail = await Student.findOne({ email });
// //     if (existingEmail) return res.status(400).json({ msg: 'Email already registered' });

// //     const existingPRN = await Student.findOne({ prn });
// //     if (existingPRN) return res.status(400).json({ msg: 'PRN already registered' });

// //     // Hash password here
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     const student = new Student({
// //       name,
// //       email,
// //       password: hashedPassword,
// //       prn,
// //       batch,
// //     });

// //     await student.save();
// //     res.status(201).json({ msg: 'Student registered successfully' });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };

// export const studentSignup = async (req, res) => {
//   try {
//     const { name, email, password, mobile } = req.body; // PRN and year removed
//     if (!name || !email || !password) // only these 3 are required
//       return res.status(400).json({ message: 'Name, email, and password are required' });

//     const existingStudent = await User.findOne({ email, role: 'student' });
//     if (existingStudent)
//       return res.status(400).json({ message: 'Student already exists' });

//     const student = await User.create({
//       name,
//       email,
//       password, // hashed automatically via pre-save hook
//       mobile,
//       role: 'student',
//     });

//     const token = jwt.sign(
//       { id: student._id, role: student.role },
//       process.env.JWT_SECRET || 'secret_key',
//       { expiresIn: '1d' }
//     );

//     res
//       .status(201)
//       .json({ message: 'Student created', token, studentId: student._id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const studentLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(req.body);
//     // Check if email and password are provided
//     if (!email || !password) {
//       return res.status(400).json({ msg: "Email and password required" });
//     }

//     // Find student by email and role
//     const student = await User.findOne({ email, role: "student" });
//     if (!student) return res.status(400).json({ msg: "Invalid credentials" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     // Create JWT
//     const token = jwt.sign(
//       { id: student._id, role: "student" },
//       process.env.JWT_SECRET || "secret_key",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       student: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         prn: student.prn,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

