import mongoose from 'mongoose';

const bucketSchema = new mongoose.Schema({
    bucketName: { type: String },
    submissionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }]
}, { timestamps: true });

export default mongoose.model('Bucket', bucketSchema);
