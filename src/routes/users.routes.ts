import { Router } from "express";
import {
    getUsers,
    getCurrentUser,
    getUserById,
    updateCurrentUser,
    deleteCurrentUser,
} from "../controller/user.controller.js";

const router = Router();

// GET /api/users - List all users / search
router.get("/", getUsers);

// GET /api/users/me - Get current logged-in user profile
// (Placed before `/:id` so "me" is not captured as an id parameter)
router.get("/me", getCurrentUser);

// PUT /api/users/me - Update current user profile
router.put("/me", updateCurrentUser);

// DELETE /api/users/me - Delete current user profile
router.delete("/me", deleteCurrentUser);

// GET /api/users/:id - Get a user by ID
router.get("/:id", getUserById);

export default router;
