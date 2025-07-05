class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Default values
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Duplicate key error (e.g., MongoDB unique fields)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // JWT: Invalid token
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Please try again!";
    err = new ErrorHandler(message, 400);
  }

  // JWT: Expired token
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Please login again!";
    err = new ErrorHandler(message, 400);
  }

  // Mongoose cast error (invalid ObjectId or similar)
  if (err.name === "CastError") {
    const message = `Invalid value for ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Validation errors (e.g., missing fields)
  const errorMessage = err.errors
    ? Object.values(err.errors).map((e) => e.message).join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
