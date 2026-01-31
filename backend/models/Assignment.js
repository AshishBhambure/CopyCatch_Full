import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    assignmentTitle: { type: String },
    questionPaperLink: { type: String }, // e.g., Cloudinary URL
    minMatchLength: { type: Number, default: 10 },
    assignemetQuestionPaperPreProcessedId: {type : String}
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
