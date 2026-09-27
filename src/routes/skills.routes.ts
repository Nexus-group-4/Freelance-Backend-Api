import { Router } from "express";
import {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
} from "../controller/skill.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js"

const router = Router();
router.use(requireAuth)

// GET /api/skills - List all skills (supports ?userId=... and ?search=...)
router.get("/", getSkills);

// GET /api/skills/:id - Get a skill by ID
router.get("/:id", getSkillById);

// POST /api/skills - Add a new skill for the authenticated user
router.post("/", createSkill);

// PUT /api/skills/:id - Update an existing skill (owner only)
router.put("/:id", updateSkill);

// DELETE /api/skills/:id - Delete a skill (owner only)
router.delete("/:id", deleteSkill);

export default router;
