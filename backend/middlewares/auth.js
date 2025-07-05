import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // 1. Check for token in cookies
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Authentication required", 401)); // Proper 401 status
  }

  try {
    // 2. Verify token with proper error handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // 3. Fetch user from database
    const user = await User.findById(decoded.id).select("+password"); // Include sensitive fields if needed
    
    // 4. Check if user still exists
    if (!user) {
      return next(new ErrorHandler("User account not found", 404));
    }
    
    // 5. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    let message = "Invalid authentication token";
    if (error instanceof jwt.TokenExpiredError) {
      message = "Session expired. Please log in again";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Invalid authentication token";
    }
    
    return next(new ErrorHandler(message, 401)); // Consistent 401 for token issues
  }
});