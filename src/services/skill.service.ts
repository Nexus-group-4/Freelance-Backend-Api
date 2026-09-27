import { prisma } from "../lib/prisma.js";

// Common selection for associated user data
const safeUserInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

/**
 * Retrieve skills with optional filters (by userId or search keyword)
 */
export const getAllSkills = async (userId?: string, search?: string) => {
    return await prisma.skill.findMany({
        where: {
            ...(userId && { userId }),
            ...(search && {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            }),
        },
        include: safeUserInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
};

/**
 * Find a single skill by ID
 */
export const findSkillById = async (id: string) => {
    return await prisma.skill.findUnique({
        where: { id },
        include: safeUserInclude,
    });
};

/**
 * Find if a user already has a skill with the same name (case-insensitive)
 */
export const findUserSkillByName = async (userId: string, name: string) => {
    return await prisma.skill.findFirst({
        where: {
            userId,
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
};

/**
 * Create a new skill for a user
 */
export const createSkill = async (userId: string, name: string) => {
    return await prisma.skill.create({
        data: {
            userId,
            name,
        },
        include: safeUserInclude,
    });
};

/**
 * Update an existing skill name
 */
export const updateSkill = async (id: string, name: string) => {
    return await prisma.skill.update({
        where: { id },
        data: { name },
        include: safeUserInclude,
    });
};

/**
 * Delete a skill by ID
 */
export const deleteSkill = async (id: string) => {
    return await prisma.skill.delete({
        where: { id },
    });
};
