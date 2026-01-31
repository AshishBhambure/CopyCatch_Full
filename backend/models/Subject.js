import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    courseCode: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    year: { type: String, enum: ['FY', 'SY', 'TY', 'LY'], required: true } // Added year
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
