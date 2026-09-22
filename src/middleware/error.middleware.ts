import { NextFunction, Request, Response } from "express";

export const errorHandler = (req: Request, res: Response, next: NextFunction, err: any) => {
    if (err.name == "ZodError") {
        return res.status(400).json({
            error: "Validation Error",
            details: err.errors
        })
    }

    const status = err.status || 500
    const message = err.message || "Internal server error"
    return res.status(status).json({ error: message })
}