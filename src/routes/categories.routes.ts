import { Router } from "express";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controller/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js"

const categoryRoutes = Router();
categoryRoutes.use(requireAuth)


// GET /api/categories - List all categories
categoryRoutes.get("/", getCategories);

// GET /api/categories/:id - Get a single category by ID
categoryRoutes.get("/:id", getCategoryById);

// POST /api/categories - Create a new category
categoryRoutes.post("/", createCategory);

// PUT /api/categories/:id - Update an existing category
categoryRoutes.put("/:id", updateCategory);

// DELETE /api/categories/:id - Delete a category
categoryRoutes.delete("/:id", deleteCategory);

export default categoryRoutes;
