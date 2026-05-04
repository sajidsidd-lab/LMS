import express from "express"
import dotenv from "dotenv"
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import quizRoutes from "./routes/quiz.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
dotenv.config()

let port = process.env.PORT
let app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://lms-1-jjlk.onrender.com",
    credentials:true
}))

// routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/quiz", quizRoutes);

// test route
app.get("/" , (req,res)=>{
    res.send("Hello From Server")
})

// 🔥 connect DB FIRST
connectDb();

app.listen(port , ()=>{
    console.log("Server Started")
})
