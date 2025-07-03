export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  
  // 1. Handle cookie expiration (default: 7 days)
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRES) || 7;
  const expirationMs = cookieExpireDays * 24 * 60 * 60 * 1000;

  // 2. Environment-aware cookie options
  const isProduction = process.env.NODE_ENV === "production";
  
  const cookieOptions = {
    expires: new Date(Date.now() + expirationMs),
    httpOnly: true, // Always prevent client-side JS access
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "None" : "Lax" // Adjust for cross-site in prod
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token, // Consider removing this if using cookies only
      user
    });
};