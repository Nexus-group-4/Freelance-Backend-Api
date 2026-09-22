import { NextFunction, Request, Response } from "express"
import * as applicationServices from "../services/application.service.js"
import { createApplicationSchema, updateApplicationSchema, updateApplicationStatusSchema } from "../schemas/application.schemas.js"
import "../types/express.d.js"

export const getAllApplications = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Authentication required" })
        }

        const applications = await applicationServices.getAllApplications(req.user!.userId, req.params.id)
        return res.status(200).json(applications)
    } catch (err) {
        next(err)
    }

}

export const getCurrentUserApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const applications = await applicationServices.getCurrentUserApplications(req.user!.userId)
        return res.status(200).json(applications)
    }
    catch (err) {
        next(err)
    }
}

export const createApplication = async (req: Request<{ jobId: string }>, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const body = req.body
        const validatedBody = createApplicationSchema.parse(body)
        const application = await applicationServices.createApplication(req.user!.userId, req.params.jobId, validatedBody)
        return res.status(201).json(application)
    } catch (err) {
        next(err)
    }

}

export const editApplication = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const body = req.body
        const validatedBody = updateApplicationSchema.parse(body)
        const application = await applicationServices.editApplication(req.user!.userId, req.params.id, validatedBody)
        return res.status(200).json(application)
    } catch (err) {
        next(err)
    }

}

export const editApplicationStatus = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const body = req.body
        const validatedBody = updateApplicationStatusSchema.parse(body)
        const application = await applicationServices.editApplicationStatus(req.user!.userId, req.params.id, validatedBody)
        return res.status(200).json(application)
    } catch (err) {
        next(err)
    }

}

export const deleteApplication = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const job = await applicationServices.deleteApplication(req.user!.userId, req.params.id)
        return res.status(204).send()
    } catch (err) {
        next(err)
    }

}

