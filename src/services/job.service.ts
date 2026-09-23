import { JobStatus } from "../generated/prisma/enums.js"
import { prisma } from "../lib/prisma.js"
import { CreateJobInput, UpdateJobInput } from "../schemas/job.schemas.js"

export const getAllJobs = async (filters: any) => {
    // optional filters by category/status and keyword search

    return await prisma.job.findMany({
        where: {
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...(filters.status && { status: filters.status }),
            ...(filters.search && {
                OR: [
                    { title: { contains: filters.search, mode: "insensitive" } },
                    { description: { contains: filters.search, mode: "insensitive" } }
                ]
            })
        }
    })
}
export const getJobById = async (id: string) => {
    return await prisma.job.findUnique({
        where: {
            id: id
        }
    })
}
export const getAllCategories = async () => {
    return await prisma.category.findMany()
}
export const createJob = async (userId: string, data: CreateJobInput) => {
    return await prisma.job.create({
        data: {
            ...data,
            clientId: userId
        }
    })
}
export const editJob = async (
    jobId: string,
    data: UpdateJobInput
) => {
    return await prisma.job.update({
        where: { id: jobId },
        data: data
    })
}
export const deleteJob = async (jobId: string) => {
    return await prisma.job.delete({ where: { id: jobId } })
}