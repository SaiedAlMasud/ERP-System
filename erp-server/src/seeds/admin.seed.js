import mongoose from "mongoose";
import { env } from "../config/env.js";
import User from "../modules/users/user.model.js";
import { USER_ROLES, USER_STATUS } from "../modules/users/user.constants.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("MongoDB connected for admin seed.");

    const existingAdmin = await User.findOne({
      role: USER_ROLES.SUPER_ADMIN,
    });

    if (existingAdmin) {
      console.log("Super Admin already exists.");
      return;
    }

    const admin = await User.create({
      firstName: "System",
      lastName: "Administrator",
      email: "admin@erp.local",
      password: "Admin@123456",
      role: USER_ROLES.SUPER_ADMIN,
      status: USER_STATUS.ACTIVE,
      isEmailVerified: true,
    });

    console.log("Super Admin created successfully.");
    console.log(`Email: ${admin.email}`);
  } catch (error) {
    console.error("Failed to create Super Admin.");
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();