export const AUTH_MESSAGES = Object.freeze({
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",

  INVALID_CREDENTIALS: "Invalid email or password.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "Access denied.",

  PASSWORD_RESET_EMAIL_SENT:
    "Password reset link has been sent to your email.",

  PASSWORD_RESET_SUCCESS:
    "Password has been reset successfully.",

  USER_NOT_FOUND: "User not found.",
});

export const AUTH_COOKIE = Object.freeze({
  ACCESS_TOKEN: "accessToken",
});

export const JWT_CONFIG = Object.freeze({
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
});