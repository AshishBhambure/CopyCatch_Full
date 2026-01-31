import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    submissionLink: { type: String}, // Cloudinary file URL
    preprocessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Preprocess' },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
