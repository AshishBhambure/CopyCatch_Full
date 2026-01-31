// // import mongoose from 'mongoose';

// // const similarityReportSchema = new mongoose.Schema({
// //     assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
// //     // submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
// // submissionId: { type: String }, // no ref
// //     plagiarisedWith: [{
// //         submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
// //         similarityScore: { type: Number },
// //         matchedContent: { type: String },
// //         matchedContentLength: { type: Number }
// //     }],
    
// // }, { timestamps: true });

// // export default mongoose.model('SimilarityReport', similarityReportSchema);



// // for testing purpsose only 

// import mongoose from 'mongoose';

// // export default mongoose.model('SimilarityReport', similarityReportSchema);
// const similarityReportSchema = new mongoose.Schema({
//     assignment_id: { type: String },
//     submission_id: { type: String }, // matches your DB
//     plagiarized_with: [{
//         submission_id: { type: String },
//         similarity_score: { type: Number },
//         matched_chunks: [String]
//     }],
// }, { timestamps: true });

// export default mongoose.model('SimilarityReport', similarityReportSchema);

// // export default mongoose.model('SimilarityReport', similarityReportSchema);


import mongoose from 'mongoose';

const similarityReportSchema = new mongoose.Schema({
    assignment_id: { type: String },
    submission_id: { type: String },
    plagiarized_with: [{
        submission_id: { type: String },
        similarity_score: { type: Number },
        matched_chunks: [String]
    }],
}, { timestamps: true });

export default mongoose.model('SimilarityReport', similarityReportSchema);
