import { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { RoleName } from "../generated/prisma/enums.js";

/**
 * Helper to get authenticated user ID from request
 */
const getAuthUserId = (req: Request): string | undefined => {
    return (req as any).user?.id || (req.headers["x-user-id"] as string);
};

/**
 * GET /api/users
 * Retrieve all users (supports ?search=..., ?skill=..., ?role=...)
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search as string | undefined;
        const skill = req.query.skill as string | undefined;
        const role = req.query.role as RoleName | undefined;

        const users = await userService.getAllUsers({
            search,
            skill,
            role,
        });

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch users",
        });
    }
};

/**
 * GET /api/users/me
 * Retrieve the currently authenticated user's profile
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getAuthUserId(req);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const user = await userService.findUserById(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user profile",
        });
    }
};

/**
 * GET /api/users/:id
 * Retrieve a specific user by ID (freelancer/client profile)
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const targetId = id === "me" ? getAuthUserId(req) : id;

        if (!targetId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const user = await userService.findUserById(targetId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user",
        });
    }
};

/**
 * PUT /api/users/me
 * Update the authenticated user's profile
 */
export const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getAuthUserId(req);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const { name, bio } = req.body;

        if (name === undefined && bio === undefined) {
            res.status(400).json({
                success: false,
                message: "At least one field (name or bio) must be provided for update",
            });
            return;
        }

        if (name !== undefined && (typeof name !== "string" || !name.trim())) {
            res.status(400).json({
                success: false,
                message: "Name must be a valid non-empty string",
            });
            return;
        }

        const existingUser = await userService.findUserById(userId);
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const updatedUser = await userService.updateUser(userId, {
            name: name ? name.trim() : undefined,
            bio: bio !== undefined ? (typeof bio === "string" ? bio.trim() : bio) : undefined,
        });

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update user profile",
        });
    }
};

/**
 * DELETE /api/users/me
 * Delete the authenticated user's account
 */
export const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getAuthUserId(req);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const existingUser = await userService.findUserById(userId);
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        await userService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete user account",
        });
    }
};

/**
 * GET /api/users/:userId/reviews
 * Retrieve reviews received by a specific user (or "me")
 */
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const paramId = (req.params.userId || req.params.id) as string;
        const targetUserId = paramId === "me" ? getAuthUserId(req) : paramId;

        if (!targetUserId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const user = await userService.findUserById(targetUserId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const reviewsData = await userService.getUserReviews(targetUserId);

        res.status(200).json({
            success: true,
            data: reviewsData,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user reviews",
        });
    }
};

/**
 * GET /api/users/:id/jobs
 * Retrieve jobs posted by a specific user (or "me")
 */
export const getUserJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const paramId = req.params.id as string;
        const targetUserId = paramId === "me" ? getAuthUserId(req) : paramId;

        if (!targetUserId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const user = await userService.findUserById(targetUserId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const jobs = await userService.getUserJobs(targetUserId);

        res.status(200).json({
            success: true,
            data: jobs,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user jobs",
        });
    }
};

/**
 * GET /api/users/:id/skills
 * Retrieve skills of a specific user (or "me")
 */
export const getUserSkills = async (req: Request, res: Response): Promise<void> => {
    try {
        const paramId = req.params.id as string;
        const targetUserId = paramId === "me" ? getAuthUserId(req) : paramId;

        if (!targetUserId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const user = await userService.findUserById(targetUserId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const skills = await userService.getUserSkills(targetUserId);

        res.status(200).json({
            success: true,
            data: skills,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user skills",
        });
    }
};
