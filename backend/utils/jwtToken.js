import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "7d", // fallback
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // ms
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};