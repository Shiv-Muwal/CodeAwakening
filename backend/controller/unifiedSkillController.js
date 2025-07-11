import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { UnifiedSkill } from "../models/unifiedSkillSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Image/Icon for skill required!", 404));
  }
  
  const { svg } = req.files;
  const { 
    name, 
    type = "technical_skill", 
    category = "other", 
    proficiency = 50, 
    experience_years = 0, 
    description = "", 
    tags = [],
    is_featured = false 
  } = req.body;

  if (!name || !type) {
    return next(new ErrorHandler("Name and type are required!", 400));
  }

  // Check if skill already exists
  const existingSkill = await UnifiedSkill.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') }
  });
  
  if (existingSkill) {
    return next(new ErrorHandler("Skill with this name already exists!", 409));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    { folder: "PORTFOLIO UNIFIED SKILLS" }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
  }

  const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

  const skill = await UnifiedSkill.create({
    name,
    type,
    category,
    proficiency: Number(proficiency),
    experience_years: Number(experience_years),
    description,
    tags: Array.isArray(parsedTags) ? parsedTags : [],
    is_featured: Boolean(is_featured),
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "New skill added successfully",
    skill,
  });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  let skill = await UnifiedSkill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found!", 404));
  }

  const updateData = { ...req.body };
  
  // Handle tags parsing if it's a string
  if (updateData.tags && typeof updateData.tags === 'string') {
    updateData.tags = JSON.parse(updateData.tags);
  }

  // Handle image update if new image is provided
  if (req.files && req.files.svg) {
    // Delete old image from cloudinary
    await cloudinary.uploader.destroy(skill.svg.public_id);
    
    // Upload new image
    const cloudinaryResponse = await cloudinary.uploader.upload(
      req.files.svg.tempFilePath,
      { folder: "PORTFOLIO UNIFIED SKILLS" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(new ErrorHandler("Failed to upload new image to Cloudinary", 500));
    }

    updateData.svg = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  skill = await UnifiedSkill.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  const skill = await UnifiedSkill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found!", 404));
  }

  // Delete image from cloudinary
  await cloudinary.uploader.destroy(skill.svg.public_id);
  
  await skill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const { 
    type, 
    category, 
    is_featured, 
    search, 
    sort_by = "created_at", 
    sort_order = "desc",
    limit,
    page = 1
  } = req.query;

  let query = {};

  // Filter by type
  if (type) {
    query.type = type;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by featured status
  if (is_featured !== undefined) {
    query.is_featured = is_featured === 'true';
  }

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  let skillsQuery = UnifiedSkill.find(query);

  // Sorting
  const sortObject = {};
  sortObject[sort_by] = sort_order === 'asc' ? 1 : -1;
  skillsQuery = skillsQuery.sort(sortObject);

  // Pagination
  if (limit) {
    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;
    skillsQuery = skillsQuery.skip(skip).limit(limitNum);
  }

  const skills = await skillsQuery;
  const totalSkills = await UnifiedSkill.countDocuments(query);

  res.status(200).json({
    success: true,
    skills,
    pagination: {
      total: totalSkills,
      page: parseInt(page),
      limit: limit ? parseInt(limit) : totalSkills,
      totalPages: limit ? Math.ceil(totalSkills / parseInt(limit)) : 1
    }
  });
});

export const getSkillById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  const skill = await UnifiedSkill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found!", 404));
  }

  res.status(200).json({
    success: true,
    skill,
  });
});

export const getSkillStats = catchAsyncErrors(async (req, res, next) => {
  const stats = await UnifiedSkill.aggregate([
    {
      $group: {
        _id: null,
        totalSkills: { $sum: 1 },
        averageProficiency: { $avg: "$proficiency" },
        skillsByType: {
          $push: {
            type: "$type",
            category: "$category"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalSkills: 1,
        averageProficiency: { $round: ["$averageProficiency", 2] },
        skillsByType: 1
      }
    }
  ]);

  const typeStats = await UnifiedSkill.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        avgProficiency: { $avg: "$proficiency" }
      }
    }
  ]);

  const categoryStats = await UnifiedSkill.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgProficiency: { $avg: "$proficiency" }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    stats: stats[0] || { totalSkills: 0, averageProficiency: 0 },
    typeBreakdown: typeStats,
    categoryBreakdown: categoryStats
  });
});

export const bulkUpdateProficiency = catchAsyncErrors(async (req, res, next) => {
  const { updates } = req.body; // Array of {id, proficiency}
  
  if (!Array.isArray(updates)) {
    return next(new ErrorHandler("Updates must be an array", 400));
  }

  const updatePromises = updates.map(({ id, proficiency }) =>
    UnifiedSkill.findByIdAndUpdate(
      id,
      { proficiency: Number(proficiency) },
      { new: true }
    )
  );

  const updatedSkills = await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: "Bulk proficiency update completed",
    updatedSkills: updatedSkills.filter(skill => skill !== null)
  });
});