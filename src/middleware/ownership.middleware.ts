import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js"


export const checkJobOwnership = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const userId = req.user!.userId
        const jobId = req.params.id

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { clientId: true },
        })

        if (!job) {
            return res.status(404).json({ message: "Job not found." })
        }

        const isOwner = job.clientId == userId
        const isAdmin = req.user!.role == "ADMIN"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        next()
    } catch (err) {
        next(err)
    }
}

export const checkApplicationOwnership = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const userId = req.user!.userId
        const applicationId = req.params.id

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { freelancerId: true },
        })

        if (!application) {
            return res.status(404).json({ message: "Application not found." })
        }

        const isOwner = application.freelancerId == userId
        const isAdmin = req.user!.role == "ADMIN"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        next()
    }
    catch (err) {
        next(err)
    }
}


// This middleware is for editting application status. Since applicant can withdraw application and client can 
// accept/reject application to  his/her job, the user must be either application or job owner

export const checkApplicationOrJobOwnership = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const application = await prisma.application.findUnique({
            where: { id: req.params.id },
            select: { applicantId: true, job: { select: { clientId: true } } },
        })

        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }

        const isAppOwner = application.applicantId === req.user!.userId
        const isJobOwner = application.job.clientId === req.user!.userId

        if (!isAppOwner && !isJobOwner) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        next()
    } catch (err) {
        next(err)
    }
}