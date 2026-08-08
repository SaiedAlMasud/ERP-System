import ApiError from "../utils/ApiError.js";
import User from "../../modules/users/user.model.js";
import { verifyAccessToken } from "../../modules/auth/auth.utils.js";
import { USER_STATUS } from "../../modules/users/user.constants.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required."
      );
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(
        401,
        "User no longer exists."
      );
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(
        403,
        "Your account is inactive or suspended."
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;