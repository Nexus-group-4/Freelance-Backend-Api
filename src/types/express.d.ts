import { type RoleName } from "../generated/prisma/enums.ts"

//Create a type for an authenticated principal for payload
export interface AuthPrincipal {
    userId: string,
    sessionId: strings,
    role: RoleName
}

//Set the type of the property auth to AuthPrincipal if present
declare global{
    namespace Express{
        interface Request{
            auth?: AuthPrincipal
        }
    }
}

//Create type for an authenticated user
export interface AuthUser{
    userId: string,
    email: string,
    role: string,
    permissions: string[],
    tokenVersion: number
}

//Set the type of the property user to AuthUser if present
declare global{
    namespace Express{
        interface Request{
            user?: AuthUser
        }
    }
}

export {}