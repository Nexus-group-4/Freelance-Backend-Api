import { z } from "zod"

const ApplicationEnum = z.enum(["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"])

export const createApplicationSchema = z.object({
    proposal: z
        .string("Proposal is required.")
        .trim()
        .max(5000, "Proposal cannot exceed 5000 characters"),
    proposedRate: z.number()
})

export const updateApplicationSchema = z.object({
    body: createApplicationSchema.partial()
})
export const updateApplicationStatusSchema = z.object({
    status: ApplicationEnum
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>
