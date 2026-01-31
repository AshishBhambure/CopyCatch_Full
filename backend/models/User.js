import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, required: true, unique: true,
        match: [/^[\w.-]+@walchandsangli\.ac\.in$/, 'Must use college email']
    },
    password: { type: String, required: true },
    mobile: { type: String },
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
    prn: { type: Number, unique: true, sparse: true, require: true }, // Only for students
    year: { type: String, enum: ['FY', 'SY', 'TY', 'LY'] } // Only for students
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);
