import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";

export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
         if(!user){
            return res.status(400).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"get current user error"})
    }
}

export const UpdateProfile = async (req,res) => {
    try {
        const userId = req.userId
        const {name , description} = req.body
        let photoUrl
        if(req.file){
           photoUrl =await uploadOnCloudinary(req.file.path)
        }
        const user = await User.findByIdAndUpdate(userId,{name,description,photoUrl})


        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        await user.save()
        return res.status(200).json(user)
    } catch (error) {
         console.log(error);
       return res.status(500).json({message:`Update Profile Error  ${error}`})
    }
}
// 👀 TRACK COURSE VIEW
export const trackView = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    const existing = user.history.find(
      item => item.courseId.toString() === courseId
    );

    if (existing) {
      existing.viewedAt = new Date();
    } else {
      user.history.push({ courseId });
    }

    await user.save();

    res.json({ message: "View tracked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 UPDATE PROGRESS
export const updateProgress = async (req, res) => {
  try {
    const { courseId, progress, timeSpent } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    const course = user.history.find(
      item => item.courseId.toString() === courseId
    );

    if (course) {
      course.progress = progress;
      course.timeSpent += timeSpent;
    }

    if (progress === 100) {
      if (!user.completedCourses.includes(courseId)) {
        user.completedCourses.push(courseId);
      }
    }

    await user.save();

    res.json({ message: "Progress updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧠 SAVE QUIZ SCORE
export const saveQuizScore = async (req, res) => {
  try {
    const { topic, score } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    user.quizScores.push({ topic, score });

    await user.save();

    res.json({ message: "Score saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};