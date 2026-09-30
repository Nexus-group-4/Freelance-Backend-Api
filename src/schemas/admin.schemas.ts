import { z } from 'zod';
import { RoleName } from '../generated/prisma/enums.js';

export const roleSchema = z.object({
        role: z.enum(RoleName)
});

export const idSchema = z.object({
        id: z.uuid()
});

export const changeRoleSchema = z.object({
    params: idSchema,

    body: roleSchema
});

export type IdParamInput = z.infer<typeof idSchema>;
export type BodyInput = z.infer<typeof roleSchema>;