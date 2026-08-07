import jwt from "jsonwebtoken";
import ApiError from "../../shared/utils/ApiError.js";
import { JWT_CONFIG } from "./auth.constants.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }
};