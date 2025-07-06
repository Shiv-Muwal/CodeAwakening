import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // 1. Get token from cookies
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Authentication required", 401));
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Get user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User account not found", 404));
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // 5. Handle JWT errors
    let message = "Invalid authentication token";

    if (error.name === "TokenExpiredError") {
      message = "Session expired. Please log in again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid authentication token";
    }

    // 6. Clear token cookie and send error
    res.clearCookie("token");

    return next(new ErrorHandler(message, 401));
  }
});
