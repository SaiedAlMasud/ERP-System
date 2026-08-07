import ApiError from "../../shared/utils/ApiError.js";
import userService from "../users/user.service.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { generateAccessToken } from "./auth.utils.js";
import { USER_STATUS } from "../users/user.constants.js";

class AuthService {
  /**
   * Login user
   */
  async login({ email, password }) {
    // Find user with password
    const user = await userService.findByEmail(email, true);

    if (!user) {
      throw new ApiError(
        401,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(
        401,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Check user status
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(
        403,
        "Your account is inactive or suspended."
      );
    }

    // Generate JWT
    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    // Update last login
    await userService.updateLastLogin(user._id);

    // Remove sensitive fields
    user.password = undefined;
    user.refreshToken = undefined;

    return {
      user,
      accessToken,
    };
  }
}

const authService = new AuthService();

export default authService;