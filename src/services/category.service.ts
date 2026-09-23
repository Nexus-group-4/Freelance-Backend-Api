import { prisma } from "../lib/prisma.js";

/**
 * Retrieve all categories with the count of associated jobs
 */
export const getAllCategories = async () => {
    return await prisma.category.findMany({
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

/**
 * Find a category by its ID (including related jobs)
 */
export const findCategoryById = async (id: string) => {
    return await prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: { jobs: true },
            },
        },
    });
};

/**
 * Find a category by its unique name (case-insensitive)
 */
export const findCategoryByName = async (name: string) => {
    return await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
};

/**
 * Create a new category
 */
export const createCategory = async (name: string) => {
    return await prisma.category.create({
        data: {
            name,
        },
    });
};

/**
 * Update a category name
 */
export const updateCategory = async (id: string, name: string) => {
    return await prisma.category.update({
        where: { id },
        data: { name },
    });
};

/**
 * Delete a category by ID
 */
export const deleteCategory = async (id: string) => {
    return await prisma.category.delete({
        where: { id },
    });
};
