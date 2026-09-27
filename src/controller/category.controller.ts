import { Request, Response } from "express";
import * as categoryService from "../services/category.service.js";

// GET /api/categories/
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch categories",
        });
    }
};

/**
 * GET /api/categories/:id
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const category = await categoryService.findCategoryById(id);

        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category",
        });
    }
};

/**
 * POST /api/categories
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Category name is required and must be a valid string",
            });
            return;
        }

        const existingCategory = await categoryService.findCategoryByName(name.trim());
        if (existingCategory) {
            res.status(409).json({
                success: false,
                message: "A category with this name already exists",
            });
            return;
        }

        const newCategory = await categoryService.createCategory(name.trim());
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create category",
        });
    }
};

/**
 * PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Category name is required and must be a valid string",
            });
            return;
        }

        const existingCategory = await categoryService.findCategoryById(id);
        if (!existingCategory) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }

        // Check if the new name is already taken by another category
        const duplicate = await categoryService.findCategoryByName(name.trim());
        if (duplicate && duplicate.id !== id) {
            res.status(409).json({
                success: false,
                message: "A category with this name already exists",
            });
            return;
        }

        const updatedCategory = await categoryService.updateCategory(id, name.trim());
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update category",
        });
    }
};

/**
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;

        const existingCategory = await categoryService.findCategoryById(id);
        if (!existingCategory) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }

        await categoryService.deleteCategory(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete category",
        });
    }
};
