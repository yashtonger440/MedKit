import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

const connectDB = () => {
   try {
     mongoose.connect(MONGO_URI);
     console.log("MongoDB Connected");
   } catch (error) {
    console.log(error);
    process.exit(1);
   }
}

export default connectDB;
