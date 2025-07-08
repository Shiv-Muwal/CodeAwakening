import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name Required!"],
  },
  email: {
    type: String,
    required: [true, "Email Required!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Required!"],
  },
  aboutMe: {
    type: String,
    required: [true, "About Me Section Is Required!"],
  },
  password: {
    type: String,
    required: [true, "Password Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  portfolioURL: {
    type: String,
    required: [true, "Portfolio URL Required!"],
  },
  githubURL: {
    type: String,
    default: null,
  },
  instagramURL: {
    type: String,
    default: null,
  },
  twitterURL: {
    type: String,
    default: null,
  },
  linkedInURL: {
    type: String,
    default: null,
  },
  facebookURL: {
    type: String,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Clean up undefined strings before saving
userSchema.pre("save", function (next) {
  // Convert "undefined" strings to null for social media URLs
  const socialFields = ['githubURL', 'instagramURL', 'twitterURL', 'linkedInURL', 'facebookURL'];
  socialFields.forEach(field => {
    if (this[field] === "undefined" || this[field] === "") {
      this[field] = null;
    }
  });
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  // Fixed expiration handling with proper validation
  const expiresIn = process.env.JWT_EXPIRES || "1d"; // Default to 1 day

  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn // Use valid string format
  });
};

userSchema.methods.getResetPasswordToken = function () {
  // Generate crypto token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration (15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);