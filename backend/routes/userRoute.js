import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getCurrentUser,
  UpdateProfile,
  trackView,
  updateProgress,
  saveQuizScore
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";

let userRouter = express.Router();

// existing routes
userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.post("/updateprofile", isAuth, upload.single("photoUrl"), UpdateProfile);

// 🔥 NEW TRACKING ROUTES
userRouter.post("/view-course", isAuth, trackView);
userRouter.post("/update-progress", isAuth, updateProgress);
userRouter.post("/quiz-score", isAuth, saveQuizScore);

export default userRouter;