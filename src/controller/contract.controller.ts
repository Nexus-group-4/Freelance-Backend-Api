import { NextFunction, Request, Response } from "express";
import * as contractServices from "../services/contract.service.js"
import { contractQueriesSchema, contractSchema } from "../schemas/contract.schemas.js";

// To get contracts for the current user
export const getAllContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queries = req.query
        const validatedQueries = contractQueriesSchema.parse(queries)
        const contracts = await contractServices.getAllContracts(req.user!.userId, validatedQueries)
        return res.status(200).json(contracts)
    } catch (err) {
        next(err)
    }
}

export const getContractById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const contract = await contractServices.getContractById(req.params.id)
        return res.status(200).json(contract)
    } catch (err) {
        next(err)
    }
}


export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const validatedBody = contractSchema.parse(body)
        const contract = await contractServices.createContract(validatedBody)
        return res.status(201).json(contract)
    } catch (err) {
        next(err)
    }
}

export const respondToContract = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body

        if (!status) {
            return res.status(400).json({ message: "Contract status is required." })
        }
        const contract = await contractServices.respondToContract(req.user!.userId, req.params.id, status)
        return res.status(201).json(contract)
    } catch (err) {
        next(err)
    }
}

export const updateContract = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body

        if (!status) {
            return res.status(400).json({ message: "Contract status is required." })
        }
        const contract = await contractServices.updateContract(req.params.id, status)
        return res.status(201).json(contract)
    } catch (err) {
        next(err)
    }
}