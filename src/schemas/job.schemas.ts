import { z } from "zod"
import { JobStatus } from "../generated/prisma/enums"

const jobEnum = z.enum(["OPEN", "CLOSED"])

export const createJobSchema = z.object({
    title: z
        .string({ message: "Job title is required" })
        .trim()
        .min(10, "Job title must be atleast 10 characters.")
        .max(256, "Job title cannot exceed 256 characters."),
    description: z
        .string({ message: "Job description is required" })
        .trim()
        .min(10, "Job description must be atleast 10 characters.")
        .max(5000, "Job description cannot exceed 5000 characters."),
    budget: z
        .number()
        .min(3, "Budget must be atleast 3 dollars."),
    clientId: z
        .uuid(),
    categoryId: z
        .uuid()

})

export const updateJobSchema = z.object({
    body: createJobSchema.partial()
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
