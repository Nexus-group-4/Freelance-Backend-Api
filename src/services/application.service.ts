import { prisma } from "../lib/prisma.js"
import { CreateApplicationInput, UpdateApplicationInput, UpdateApplicationStatusInput } from "../schemas/application.schemas"

export const getAllApplications = async (jobId: string) => {
    return await prisma.application.findMany({
        where: { jobId: jobId }
    })
}
export const getCurrentUserApplications = async (userId: string) => {
    return await prisma.application.findMany({
        where: { freelancerId: userId }
    })
}
export const createApplication = async (userId: string, jobId: string, data: CreateApplicationInput) => {
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
        throw { status: 404, message: "Job not found." }
    }
    if (job.clientId == userId) {
        throw { status: 403, message: "You cannot apply to your own job." }
    }
    const existingApplication = await prisma.application.findFirst({ where: { freelancerId: userId, jobId: jobId } })
    if (existingApplication) {
        throw { status: 400, message: "You have already submitted an application to this job." }
    }
    return await prisma.application.create({
        data: {
            ...data,
            jobId: jobId,
            freelancerId: userId
        }
    })
}
export const editApplication = async (id: string, data: UpdateApplicationInput) => {
    const application = await prisma.application.findUnique({ where: { id } })
    if (application!.status != "PENDING") {
        throw { status: 400, message: "Accepted, rejected or withdrawn applications cannot be editted." }
    }
    return await prisma.application.update({ where: { id }, data: data })
}

export const editApplicationStatus = async (userId: string, id: string, data: UpdateApplicationStatusInput) => {
    const application = await prisma.application.findUnique({ where: { id }, include: { job: true } })
    if (!application) {
        throw { status: 404, message: "Application not found." }
    }
    const isClient = userId == application.job.clientId
    const isFreelancer = userId == application.freelancerId

    if (data.status == "WITHDRAWN") {
        if (!isFreelancer) {
            throw { status: 403, message: "Only freelancer can withdraw an application." }
        }
    }
    else if (data.status == "ACCEPTED" || data.status == "REJECTED") {
        if (!isClient) {
            throw { status: 403, message: "Only client can accept or reject an application." }
        }
    }
    else {
        throw { status: 400, message: "Invalid status." }
    }
    return await prisma.application.update({ where: { id }, data: data })
}

export const deleteApplication = async (id: string) => {
    return await prisma.application.delete({ where: { id } })
}