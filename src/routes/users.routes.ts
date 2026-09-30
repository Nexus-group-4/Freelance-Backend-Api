import { Router } from "express";
import {
    getUsers,
    getCurrentUser,
    getUserById,
    updateCurrentUser,
    deleteCurrentUser,
    getUserReviews,
    getUserJobs,
    getUserSkills,
} from "../controller/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js"

const router = Router();
router.use(requireAuth)

// GET /api/users - List all users / search by name, bio, skill, role
router.get("/", getUsers);

// GET /api/users/me - Get current logged-in user profile
// (Placed before `/:id` so "me" is not captured as an id parameter)
router.get("/me", getCurrentUser);

// PUT /api/users/me - Update current user profile
router.put("/me", updateCurrentUser);

// DELETE /api/users/me - Delete current user profile
router.delete("/me", deleteCurrentUser);

// GET /api/users/:userId/reviews - Get reviews received by a user (or "me")
router.get("/:userId/reviews", getUserReviews);

// GET /api/users/:id/jobs - Get jobs posted by a user (or "me")
router.get("/:id/jobs", getUserJobs);

// GET /api/users/:id/skills - Get skills belonging to a user (or "me")
router.get("/:id/skills", getUserSkills);

// GET /api/users/:id - Get a user profile by ID
router.get("/:id", getUserById);

export default router;
