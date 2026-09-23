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