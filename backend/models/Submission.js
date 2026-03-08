import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    submissionLink: { type: String}, // Cloudinary file URL
    preprocessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Preprocess' },
    submittedAt: { type: Date, default: Date.now },
    version: {type: Number},
}, { timestamps: true });

// PRE SAVE 
submissionSchema.pre('save', async function (next) {
    try {

        if (!this.isNew) return next();

        const Submission = mongoose.model('Submission');

        const count = await Submission.countDocuments({
            assignmentId: this.assignmentId,
            studentId: this.studentId
        });

        this.version = count + 1;

        next();

    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Submission', submissionSchema);
