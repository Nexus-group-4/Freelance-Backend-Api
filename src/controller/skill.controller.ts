import { Request, Response } from "express";
import * as skillService from "../services/skill.service.js";

/**
 * GET /api/skills
 * List all skills (supports ?userId=... and ?search=...)
 */
export const getSkills = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId as string | undefined;
        const search = req.query.search as string | undefined;

        const skills = await skillService.getAllSkills(userId, search);

        res.status(200).json({
            success: true,
            data: skills,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch skills",
        });
    }
};

/**
 * GET /api/skills/:id
 * Retrieve a specific skill by ID
 */
export const getSkillById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const skill = await skillService.findSkillById(id);

        if (!skill) {
            res.status(404).json({
                success: false,
                message: "Skill not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: skill,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch skill",
        });
    }
};

/**
 * POST /api/skills
 * Add a new skill for the authenticated user
 */
export const createSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id || (req.headers["x-user-id"] as string);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const { name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Skill name is required and must be a non-empty string",
            });
            return;
        }

        // Check if user already added this skill
        const existingSkill = await skillService.findUserSkillByName(userId, name.trim());
        if (existingSkill) {
            res.status(409).json({
                success: false,
                message: "You have already added this skill to your profile",
            });
            return;
        }

        const newSkill = await skillService.createSkill(userId, name.trim());

        res.status(201).json({
            success: true,
            message: "Skill added successfully",
            data: newSkill,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create skill",
        });
    }
};

/**
 * PUT /api/skills/:id
 * Update an existing skill (Ownership verified)
 */
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id || (req.headers["x-user-id"] as string);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const id = req.params.id as string;
        const { name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Skill name is required and must be a non-empty string",
            });
            return;
        }

        const existingSkill = await skillService.findSkillById(id);
        if (!existingSkill) {
            res.status(404).json({
                success: false,
                message: "Skill not found",
            });
            return;
        }

        // Check ownership
        if (existingSkill.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You do not have permission to edit this skill",
            });
            return;
        }

        // Check duplicate name for the same user
        const duplicate = await skillService.findUserSkillByName(userId, name.trim());
        if (duplicate && duplicate.id !== id) {
            res.status(409).json({
                success: false,
                message: "You already have another skill with this name",
            });
            return;
        }

        const updatedSkill = await skillService.updateSkill(id, name.trim());

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            data: updatedSkill,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update skill",
        });
    }
};

/**
 * DELETE /api/skills/:id
 * Delete a skill (Ownership verified)
 */
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id || (req.headers["x-user-id"] as string);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const id = req.params.id as string;

        const existingSkill = await skillService.findSkillById(id);
        if (!existingSkill) {
            res.status(404).json({
                success: false,
                message: "Skill not found",
            });
            return;
        }

        // Check ownership
        if (existingSkill.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You do not have permission to delete this skill",
            });
            return;
        }

        await skillService.deleteSkill(id);

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete skill",
        });
    }
};
