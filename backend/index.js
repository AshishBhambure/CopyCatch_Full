import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import adminRoutes from './routes/adminRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import similarityRoutes from './routes/similarityRoutes.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cors());
// for testing wan to goove all address access to use
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/similarity', similarityRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/similarity', similarityRoutes);

// basic health
app.get('/', (req,res) => res.send('CopyCatch backend is up'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));
