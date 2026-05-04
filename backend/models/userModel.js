import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    description: {
      type: String
    },
    role: {
      type: String,
      enum: ["educator", "student"],
      required: true
    },
    photoUrl: {
      type: String,
      default: ""
    },
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],

    // 🔥 NEW FIELDS FOR AI RECOMMENDATION
    interests: {
      type: [String],
      default: []
    },
   // 🔥 AI TRACKING FIELDS
history: [
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    viewedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number,
      default: 0
    }
  }
],

completedCourses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
],

quizScores: [
  {
    topic: String,
    score: Number
  }
],
    resetOtp:{
      type:String
    },
    otpExpires:{
      type:Date
    },
    isOtpVerifed:{
      type:Boolean,
      default:false
    }
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;