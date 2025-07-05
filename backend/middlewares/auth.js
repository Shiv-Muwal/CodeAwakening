import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Authentication required", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Fetch user without sensitive fields
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler("User account not found", 404));
    }
    
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    let message = "Invalid authentication token";
    
    if (error.name === "TokenExpiredError") {
      message = "Session expired. Please log in again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid authentication token";
    }
    
    // Clear invalid token cookie
    res.clearCookie("token");
    
    return next(new ErrorHandler(message, 401));
  }
});