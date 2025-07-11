import { Skill } from "../models/skillSchema.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { UnifiedSkill } from "../models/unifiedSkillSchema.js";

export const migrateToUnifiedSkills = async () => {
  try {
    console.log("Starting migration to unified skills system...");

    // Check if migration has already been run
    const existingUnifiedSkills = await UnifiedSkill.countDocuments();
    if (existingUnifiedSkills > 0) {
      console.log("Migration appears to have already been run. Skipping...");
      return {
        success: true,
        message: "Migration already completed",
        migrated: { skills: 0, applications: 0 }
      };
    }

    // Migrate existing skills
    const existingSkills = await Skill.find();
    let migratedSkills = 0;

    for (const skill of existingSkills) {
      await UnifiedSkill.create({
        name: skill.title,
        type: "technical_skill",
        category: inferCategory(skill.title),
        proficiency: skill.proficiency || 50,
        svg: skill.svg,
        tags: [skill.title.toLowerCase()],
        is_featured: skill.proficiency > 80
      });
      migratedSkills++;
    }

    // Migrate existing software applications
    const existingApplications = await SoftwareApplication.find();
    let migratedApplications = 0;

    for (const app of existingApplications) {
      await UnifiedSkill.create({
        name: app.name,
        type: "software_application",
        category: inferApplicationCategory(app.name),
        proficiency: 75, // Default proficiency for software applications
        svg: app.svg,
        tags: [app.name.toLowerCase()],
        is_featured: false
      });
      migratedApplications++;
    }

    console.log(`Migration completed successfully!`);
    console.log(`Migrated ${migratedSkills} skills and ${migratedApplications} software applications`);

    return {
      success: true,
      message: "Migration completed successfully",
      migrated: {
        skills: migratedSkills,
        applications: migratedApplications
      }
    };

  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      message: "Migration failed",
      error: error.message
    };
  }
};

// Helper function to infer category from skill title
function inferCategory(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('javascript') || titleLower.includes('python') || titleLower.includes('java') || 
      titleLower.includes('react') || titleLower.includes('node') || titleLower.includes('html') || 
      titleLower.includes('css') || titleLower.includes('typescript')) {
    return "programming";
  }
  if (titleLower.includes('photoshop') || titleLower.includes('figma') || titleLower.includes('design')) {
    return "design";
  }
  if (titleLower.includes('mysql') || titleLower.includes('mongodb') || titleLower.includes('database')) {
    return "database";
  }
  if (titleLower.includes('docker') || titleLower.includes('aws') || titleLower.includes('deployment')) {
    return "devops";
  }
  if (titleLower.includes('test') || titleLower.includes('jest') || titleLower.includes('cypress')) {
    return "testing";
  }
  
  return "other";
}

// Helper function to infer category from application name
function inferApplicationCategory(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('visual studio') || nameLower.includes('vscode') || nameLower.includes('ide') || 
      nameLower.includes('editor') || nameLower.includes('sublime') || nameLower.includes('atom')) {
    return "programming";
  }
  if (nameLower.includes('photoshop') || nameLower.includes('illustrator') || nameLower.includes('figma') || 
      nameLower.includes('sketch') || nameLower.includes('canva')) {
    return "design";
  }
  if (nameLower.includes('mysql') || nameLower.includes('mongodb') || nameLower.includes('postgres') || 
      nameLower.includes('redis') || nameLower.includes('database')) {
    return "database";
  }
  if (nameLower.includes('docker') || nameLower.includes('kubernetes') || nameLower.includes('aws') || 
      nameLower.includes('jenkins') || nameLower.includes('git')) {
    return "devops";
  }
  if (nameLower.includes('postman') || nameLower.includes('insomnia') || nameLower.includes('test')) {
    return "testing";
  }
  if (nameLower.includes('slack') || nameLower.includes('teams') || nameLower.includes('zoom') || 
      nameLower.includes('communication')) {
    return "communication";
  }
  if (nameLower.includes('jira') || nameLower.includes('trello') || nameLower.includes('asana') || 
      nameLower.includes('project')) {
    return "project_management";
  }
  
  return "other";
}

export const rollbackMigration = async () => {
  try {
    console.log("Rolling back unified skills migration...");
    
    await UnifiedSkill.deleteMany({});
    
    console.log("Migration rollback completed successfully!");
    
    return {
      success: true,
      message: "Migration rollback completed successfully"
    };
    
  } catch (error) {
    console.error("Rollback failed:", error);
    return {
      success: false,
      message: "Rollback failed",
      error: error.message
    };
  }
};