import mongoose from "mongoose";

const preprocessSchema = new mongoose.Schema({
  submission_id: { type: String, required: true },
  file_url: { type: String },
  raw_text: { type: String },
  processed_text: { type: String },
  minhash_signature: [{ type: String }]
}, { timestamps: true });

// Note the third argument is the **exact collection name in MongoDB**
export default mongoose.model("PreProcessing", preprocessSchema, "PreProcessing");
