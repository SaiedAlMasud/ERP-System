import User from "./user.model.js";
import ApiError from "../../shared/utils/ApiError.js";

class UserService {
  /**
   * Find user by email
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });

    if (includePassword) {
      query.select("+password +refreshToken");
    }

    return await query;
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    const user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  /**
   * Create user
   */
  async create(userData) {
    const existingUser = await this.findByEmail(userData.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await User.create(userData);

    return user;
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }

  /**
   * Save refresh token
   */
  async saveRefreshToken(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, {
      refreshToken,
    });
  }

  /**
   * Remove refresh token
   */
  async removeRefreshToken(userId) {
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }
}

const userService = new UserService();

export default userService;