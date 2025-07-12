import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message } = req.body;
  
  // Fast validation - check for required fields
  if (!senderName?.trim() || !subject?.trim() || !message?.trim()) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Additional validation for length
  if (senderName.trim().length < 2) {
    return next(new ErrorHandler("Name Must Contain At Least 2 Characters!", 400));
  }
  if (subject.trim().length < 2) {
    return next(new ErrorHandler("Subject Must Contain At Least 2 Characters!", 400));
  }
  if (message.trim().length < 2) {
    return next(new ErrorHandler("Message Must Contain At Least 2 Characters!", 400));
  }

  // Sanitize inputs
  const sanitizedData = {
    senderName: senderName.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  // Create message with optimized options
  const data = await Message.create(sanitizedData, {
    // Optimize for write performance
    lean: false,
    // Set explicit timestamps
    timestamps: true,
  });

  // Return minimal response for faster transmission
  res.status(201).json({
    success: true,
    message: "Message Sent",
    data: {
      id: data._id,
      senderName: data.senderName,
      subject: data.subject,
      createdAt: data.createdAt,
    },
  });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return next(new ErrorHandler("Message ID is required!", 400));
  }

  const message = await Message.findById(id).lean();
  if (!message) {
    return next(new ErrorHandler("Message Already Deleted!", 400));
  }
  
  await Message.findByIdAndDelete(id);
  
  res.status(200).json({
    success: true,
    message: "Message Deleted",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  // Optimize query with projection and sorting
  const messages = await Message.find({}, {
    senderName: 1,
    subject: 1,
    message: 1,
    createdAt: 1,
  })
  .sort({ createdAt: -1 })
  .lean()
  .limit(100); // Limit results for performance
  
  res.status(200).json({
    success: true,
    messages,
  });
});