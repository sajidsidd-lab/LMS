import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected :",mongoose.connection.name)
    } catch (error) {
        console.log("DB error")
    }
}
export default connectDb