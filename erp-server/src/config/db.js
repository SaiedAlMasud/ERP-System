import mongoose from "mongoose";
import logger from "../shared/utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    logger.success("MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");

    logger.error(error.message);

    process.exit(1);
  }
};