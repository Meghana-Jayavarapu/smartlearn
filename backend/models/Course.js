import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: String,
  category: String,
  level: String,
  thumbnail: String,
  description: String,
  syllabus: [String],
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
