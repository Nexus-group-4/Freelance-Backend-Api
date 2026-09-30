import { prisma } from "../lib/prisma.js";
import { RoleName } from "../generated/prisma/enums.js";

// Common selection to avoid exposing sensitive fields (passwordHash, tokenVersion)
export const safeUserSelect = {
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
 * Retrieve all users with optional search and filtering (by name, bio, skill, role)
 */
export const getAllUsers = async (filters?: {
    search?: string;
    skill?: string;
    role?: RoleName;
}) => {
    const { search, skill, role } = filters || {};

    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { bio: { contains: search, mode: "insensitive" } },
            {
                skills: {
                    some: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
            },
        ];
    }

    if (skill) {
        where.skills = {
            some: {
                name: { contains: skill, mode: "insensitive" },
            },
        };
    }

    if (role) {
        where.role = {
            name: role,
        };
    }

    return await prisma.user.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
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

/**
 * Get reviews received by a user (including reviewer and job information)
 */
export const getUserReviews = async (userId: string) => {
    const reviews = await prisma.review.findMany({
        where: { revieweeId: userId },
        include: {
            reviewer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            contract: {
                select: {
                    id: true,
                    agreedRate: true,
                    status: true,
                    application: {
                        select: {
                            id: true,
                            job: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const totalReviews = reviews.length;
    const averageRating =
        totalReviews > 0
            ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(2))
            : null;

    return {
        totalReviews,
        averageRating,
        reviews,
    };
};

/**
 * Get jobs posted by a user (client)
 */
export const getUserJobs = async (userId: string) => {
    return await prisma.job.findMany({
        where: { clientId: userId },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: {
                    applications: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

/**
 * Get skills associated with a user (freelancer)
 */
export const getUserSkills = async (userId: string) => {
    return await prisma.skill.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
    });
};
