import mongoose from "mongoose";

const unifiedSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["technical_skill", "software_application", "soft_skill", "framework", "language", "tool"],
    required: true,
    default: "technical_skill"
  },
  category: {
    type: String,
    enum: ["programming", "design", "database", "devops", "testing", "project_management", "communication", "other"],
    default: "other"
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 100,
    default: 50
  },
  experience_years: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  svg: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  tags: [{
    type: String,
    trim: true
  }],
  is_featured: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
unifiedSkillSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for better query performance
unifiedSkillSchema.index({ type: 1, category: 1 });
unifiedSkillSchema.index({ name: 'text', description: 'text' });

export const UnifiedSkill = mongoose.model("UnifiedSkill", unifiedSkillSchema);