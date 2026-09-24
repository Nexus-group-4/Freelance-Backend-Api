import { prisma } from "../lib/prisma.js";

// Common selection to avoid exposing sensitive fields (passwordHash, tokenVersion)
const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    bio: true,
    roleId: true,
    createdAt: true,
    updatedAt: true,
    role: {
        select: {
            id: true,
            name: true,
        },
    },
    skills: {
        select: {
            id: true,
            name: true,
        },
    },
    reviewsReceived: {
        select: {
            id: true,
            rating: true,
            comment: true,
            reviewer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdAt: true,
        },
    },
    _count: {
        select: {
            jobs: true,
            applications: true,
            reviewsReceived: true,
        },
    },
};

/**
 * Retrieve all users with optional search/filtering
 */
export const getAllUsers = async (search?: string) => {
    return await prisma.user.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { bio: { contains: search, mode: "insensitive" } },
                ],
            }
            : undefined,
        select: safeUserSelect,
        orderBy: {
            createdAt: "desc",
        },
    });
};

/**
 * Find a user by ID
 */
export const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
        select: safeUserSelect,
    });
};

/**
 * Find a user by email
 */
export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: safeUserSelect,
    });
};

/**
 * Update user profile (name, bio)
 */
export const updateUser = async (
    id: string,
    data: { name?: string; bio?: string }
) => {
    return await prisma.user.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.bio !== undefined && { bio: data.bio }),
        },
        select: safeUserSelect,
    });
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: { id },
    });
};
