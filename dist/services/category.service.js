"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.findCategoryByName = exports.findCategoryById = exports.getAllCategories = void 0;
const prisma_js_1 = require("../lib/prisma.js");
/**
 * Retrieve all categories with the count of associated jobs
 */
const getAllCategories = async () => {
    return await prisma_js_1.prisma.category.findMany({
        include: {
            _count: {
                select: { jobs: true },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
};
exports.getAllCategories = getAllCategories;
/**
 * Find a category by its ID (including related jobs)
 */
const findCategoryById = async (id) => {
    return await prisma_js_1.prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: { jobs: true },
            },
        },
    });
};
exports.findCategoryById = findCategoryById;
/**
 * Find a category by its unique name (case-insensitive)
 */
const findCategoryByName = async (name) => {
    return await prisma_js_1.prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
};
exports.findCategoryByName = findCategoryByName;
/**
 * Create a new category
 */
const createCategory = async (name) => {
    return await prisma_js_1.prisma.category.create({
        data: {
            name,
        },
    });
};
exports.createCategory = createCategory;
/**
 * Update a category name
 */
const updateCategory = async (id, name) => {
    return await prisma_js_1.prisma.category.update({
        where: { id },
        data: { name },
    });
};
exports.updateCategory = updateCategory;
/**
 * Delete a category by ID
 */
const deleteCategory = async (id) => {
    return await prisma_js_1.prisma.category.delete({
        where: { id },
    });
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.service.js.map