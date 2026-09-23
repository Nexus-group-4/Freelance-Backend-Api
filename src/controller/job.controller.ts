import { NextFunction, Request, Response } from "express"
import * as jobServices from "../services/job.service.js"
import { createJobSchema, updateJobSchema } from "../schemas/job.schemas.js"
import "../types/express.d.js"

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await jobServices.getAllJobs(req.query)
        return res.status(200).json(jobs)
    } catch (err) {
        next(err)
    }

}

export const getJobById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const job = await jobServices.getJobById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: "Job not found." })
        }
        return res.status(200).json(job)
    } catch (err) {
        next(err)
    }

}

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await jobServices.getAllCategories()
        return res.status(200).json(categories)
    } catch (err) {
        next(err)
    }

}

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const validatedBody = createJobSchema.parse(body)
        const job = await jobServices.createJob(req.user!.userId, validatedBody)
        return res.status(201).json(job)
    } catch (err) {
        next(err)
    }

}

export const editJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const validatedBody = updateJobSchema.parse(body)
        const job = await jobServices.editJob(req.params.id, validatedBody)
        return res.status(200).json(job)
    } catch (err) {
        next(err)
    }

}

export const deleteJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const job = await jobServices.deleteJob(req.params.id)
        return res.status(200).json(job)
    } catch (err) {
        next(err)
    }

}