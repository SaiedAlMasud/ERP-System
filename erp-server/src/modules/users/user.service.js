import User from "./user.model.js";
import ApiError from "../../shared/utils/ApiError.js";

class UserService {
  // ===========================
  // Find User by Email
  // ===========================

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });

    if (includePassword) {
      query.select("+password +refreshToken");
    }

    return await query;
  }

  // ===========================
  // Find User by ID
  // ===========================

  async findById(id) {
    const user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  // ===========================
  // Create User
  // ===========================

  async create(userData, createdBy = null) {
    const existingUser = await this.findByEmail(userData.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists.");
    }

    const user = await User.create({
      ...userData,
      createdBy,
      updatedBy: createdBy,
    });

    return user;
  }

  // ===========================
  // Get All Users
  // ===========================

  async getAll(filters = {}) {
    const {
      role,
      status,
      search,
      page = 1,
      limit = 10,
    } = filters;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===========================
  // Update User
  // ===========================

  async update(id, updateData, updatedBy = null) {
    const user = await this.findById(id);

    if (
      updateData.email &&
      updateData.email !== user.email
    ) {
      const existingUser = await this.findByEmail(
        updateData.email
      );

      if (
        existingUser &&
        existingUser._id.toString() !== id
      ) {
        throw new ApiError(409, "Email already exists.");
      }
    }

    Object.assign(user, updateData);

    user.updatedBy = updatedBy;

    await user.save();

    return user;
  }

  // ===========================
  // Update User Status
  // ===========================

  async updateStatus(id, status, updatedBy = null) {
    const user = await this.findById(id);

    user.status = status;
    user.updatedBy = updatedBy;

    await user.save();

    return user;
  }

  // ===========================
  // Update Last Login
  // ===========================

  async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }

  // ===========================
  // Save Refresh Token
  // ===========================

  async saveRefreshToken(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, {
      refreshToken,
    });
  }

  // ===========================
  // Remove Refresh Token
  // ===========================

  async removeRefreshToken(userId) {
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }
}

const userService = new UserService();

export default userService;