// export const generateToken = (user, message, statusCode, res) => {
//   const token = user.generateJsonWebToken();

//   const cookieExpireDays = process.env.COOKIE_EXPIRES
//     ? parseInt(process.env.COOKIE_EXPIRES, 10)
//     : 7; // Default to 7 days if not set

//   const options = {
//     expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000), 
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", 
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//   };

//   res.status(statusCode)
//     .cookie("token", token, options)
//     .json({
//       success: true,
//       message,
//       user,
//       token,
//     });
// };
// utils/jwtToken.js
export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:true, // Use secure cookies in production
    sameSite: "None" // Use 'Strict' or 'Lax' based on
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user
    });
};

export default generateToken;