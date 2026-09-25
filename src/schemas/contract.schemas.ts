import { z } from "zod"

const contractStatuses = z.enum(["OFFERED", "DECLINED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])

export const contractSchema = z.object({
    applicationId: z.uuid(),
    agreedRate: z.number()
})

export const contractQueriesSchema = z.object({
    status: contractStatuses.optional()
})

export type ContractInput = z.infer<typeof contractSchema>
export type ContractQueries = z.infer<typeof contractQueriesSchema>