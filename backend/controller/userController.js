import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar And Resume Required!", 400));
  }
  const { avatar, resume } = req.files;

  //POSTING AVATAR
  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "AVATARS" }
  );

  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  //POSTING RESUME
  const cloudinaryResponseForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "MY_RESUME" }
  );
  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForResume.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
  }
  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    discordURL,
    facebookURL,
    linkedInURL,
  } = req.body;

  // Helper function to clean URL values for registration
  const cleanURLForRegistration = (url) => {
    if (!url || url === "undefined" || url === "null" || url.trim() === "") {
      return undefined;
    }
    const cleanedUrl = url.trim();
    
    // Basic URL validation
    if (cleanedUrl && !cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      return `https://${cleanedUrl}`;
    }
    return cleanedUrl;
  };

  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL: cleanURLForRegistration(githubURL),
    instagramURL: cleanURLForRegistration(instagramURL),
    discordURL: cleanURLForRegistration(discordURL),
    facebookURL: cleanURLForRegistration(facebookURL),
    linkedInURL: cleanURLForRegistration(linkedInURL),
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url, 
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id,
      url: cloudinaryResponseForResume.secure_url,
    },
  });
  generateToken(user, "Registered Successfully!", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 404));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }
  generateToken(user, "Login Successfully!", 200, res);
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true, // Use secure cookies in production
      sameSite: "None", // Use 'Strict' or 'Lax' based on your requirements
    })
    .json({
      success: true,
      message: "Logged Out!",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  // Helper function to clean and validate URL values
  const cleanURL = (url) => {
    if (!url || url === "undefined" || url === "null" || url.trim() === "") {
      return undefined;
    }
    const cleanedUrl = url.trim();
    
    // Basic URL validation
    if (cleanedUrl && !cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      return `https://${cleanedUrl}`;
    }
    return cleanedUrl;
  };

  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    githubURL: cleanURL(req.body.githubURL),
    instagramURL: cleanURL(req.body.instagramURL),
    portfolioURL: req.body.portfolioURL,
    facebookURL: cleanURL(req.body.facebookURL),
    discordURL: cleanURL(req.body.discordURL),
    linkedInURL: cleanURL(req.body.linkedInURL),
  };
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const newProfileImage = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "AVATARS",
      }
    );
    newUserData.avatar = {
      public_id: newProfileImage.public_id,
      url: newProfileImage.secure_url,
    };
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeFileId = user.resume.public_id;
    if (resumeFileId) {
      await cloudinary.uploader.destroy(resumeFileId);
    }
    const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
      folder: "MY_RESUME",
    });
    newUserData.resume = {
      public_id: newResume.public_id,
      url: newResume.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile Updated!",
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect current password", 401));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler("New password and confirmation do not match", 400)
    );
  }
  const isSameAsCurrent = await user.comparePassword(newPassword);
  if (isSameAsCurrent) {
    return next(
      new ErrorHandler("New password cannot be the same as current password", 400)
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = "686a5229e7930078dc9f0e50";
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  const user = await User.findOne({ email });
  
  // const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If You've not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Personal Portfolio Dashboard Password Recovery`,
      message,
    });
    res.status(201).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});


export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password do not match"));
  }
  user.password = await req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, "Reset Password Successfully!", 200, res);
});
