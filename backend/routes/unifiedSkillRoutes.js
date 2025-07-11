import express from "express";
import {
  addNewSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
  getSkillById,
  getSkillStats,
  bulkUpdateProficiency
} from "../controller/unifiedSkillController.js";
import { migrateToUnifiedSkills, rollbackMigration } from "../utils/skillMigration.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Core CRUD operations
router.post("/add", isAuthenticated, addNewSkill);
router.get("/getall", getAllSkills);
router.get("/stats", getSkillStats);
router.get("/:id", getSkillById);
router.put("/update/:id", isAuthenticated, updateSkill);
router.delete("/delete/:id", isAuthenticated, deleteSkill);

// Bulk operations
router.put("/bulk/proficiency", isAuthenticated, bulkUpdateProficiency);

// Migration endpoints (admin only)
router.post("/migrate", isAuthenticated, async (req, res, next) => {
  try {
    const result = await migrateToUnifiedSkills();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Migration failed",
      error: error.message
    });
  }
});

router.post("/rollback", isAuthenticated, async (req, res, next) => {
  try {
    const result = await rollbackMigration();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Rollback failed", 
      error: error.message
    });
  }
});

// Legacy endpoints for backward compatibility
router.get("/legacy/skills", getAllSkills);
router.get("/legacy/applications", (req, res, next) => {
  req.query.type = "software_application";
  next();
}, getAllSkills);

export default router;