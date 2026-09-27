import { prisma } from "../lib/prisma.js"
import { ContractInput, ContractQueries } from "../schemas/contract.schemas.js"


export const getAllContracts = async (userId: string, queries: ContractQueries) => {
    // optional filter by status 
    return prisma.contract.findMany({
        where: {
            ...(queries.status && { status: queries.status }),
            application: {
                OR: [
                    { freelancerId: userId },
                    { job: { clientId: userId } }
                ]
            }
        }
    });
}

export const getContractById = async (id: string) => {
    return await prisma.contract.findUnique({ where: { id } })
}


export const createContract = async (data: ContractInput) => {
    const application = await prisma.application.findUnique({ where: { id: data.applicationId } })
    if (!application) {
        throw { status: 404, message: "Application not found" }
    }
    if (application.status !== "ACCEPTED") {
        throw { status: 400, message: "Cannot offer contract unless application status is accepted." }
    }
    const existingContract = await prisma.contract.findFirst({
        where: {
            applicationId: data.applicationId
        }
    })
    if (existingContract) {
        throw { status: 409, message: "Contract for this application already exists." }
    }
    return await prisma.contract.create({
        data: {
            ...data
        }
    })
}

export const respondToContract = async (userId: string, id: string, response: string) => {
    if (response != "DECLINED" && response != "IN_PROGRESS") {
        throw { status: 400, message: "Invalid contract response." }
    }
    const contract = await prisma.contract.findUnique({
        where: { id },
        select: {
            status: true,
            application: { select: { freelancerId: true } }
        }
    })
    if (!contract) {
        throw { status: 404, message: "Contract not found." }
    }
    if (contract.application.freelancerId !== userId) {
        throw { status: 403, message: "Only freelancer can respond to contract." };
    }
    if (contract.status != "OFFERED") {
        throw { status: 400, message: "Contract cannot be responded to." }
    }
    return await prisma.contract.update({
        where: { id },
        data: {
            status: response
        }
    })

}

export const updateContract = async (id: string, status: string) => {
    const contract = await prisma.contract.findUnique({ where: { id } })
    if (status !== "COMPLETED" && status !== "CANCELLED") {
        throw { status: 400, message: "Invalid status." };
    }
    if (!contract) {
        throw { status: 404, message: "Contract not found." }
    }
    if (status == "COMPLETED" && contract.status != "IN_PROGRESS") {
        throw { status: 400, message: "Only contract in progress can be marked complete." }
    }
    if (status == "CANCELLED" && !(contract.status == "IN_PROGRESS" || contract.status == "OFFERED")) {
        throw { status: 400, message: "Only contract in progress can be cancelled." }
    }

    return await prisma.contract.update({
        where: { id },
        data: {
            status: status
        }
    })
}