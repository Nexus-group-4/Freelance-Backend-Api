"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const categoryService = __importStar(require("../services/category.service.js"));
// GET /api/categories/
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch categories",
        });
    }
};
exports.getCategories = getCategories;
/**
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category",
        });
    }
};
exports.getCategoryById = getCategoryById;
/**
 * POST /api/categories
 */
const createCategory = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create category",
        });
    }
};
exports.createCategory = createCategory;
/**
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update category",
        });
    }
};
exports.updateCategory = updateCategory;
/**
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete category",
        });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map