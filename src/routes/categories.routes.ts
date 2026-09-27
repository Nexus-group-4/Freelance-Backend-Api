import { Router } from "express";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controller/category.controller.js";

const router = Router();

// GET /api/categories - List all categories
router.get("/", getCategories);

// GET /api/categories/:id - Get a single category by ID
router.get("/:id", getCategoryById);

// POST /api/categories - Create a new category
router.post("/", createCategory);

// PUT /api/categories/:id - Update an existing category
router.put("/:id", updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete("/:id", deleteCategory);

export default router;
