import { z } from 'zod';

//email schema
export const emailSchema = z
    .email('Enter a valid email address!')
    .trim()
    .max(254)
    .transform((email) => email.toLowerCase());

//password schema
export const passwordSchema = z
    .string()
    .trim()
    .min(12, 'Password must be a minimum of 12 characters!')
    .max(128,'Password must be a maximum of 128 characters!')

//registration schema
export const registerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1),
        email: emailSchema,
        password: passwordSchema
    })
});

//Login schema
export const loginSchema = z.object({
    body: z.object({
        email:emailSchema,
        password: z.string().min(1).max(128),
    })
});


//create types based on zod schemas
export type RegisterBody = z.infer<typeof registerSchema>["body"];
export type LoginBody = z.infer<typeof loginSchema>["body"];
export type Password = z.infer<typeof passwordSchema>;
export type Email = z.infer<typeof emailSchema>;