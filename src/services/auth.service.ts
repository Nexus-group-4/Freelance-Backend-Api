import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { Password,Email } from '../schemas/auth.schemas.js';
import { createToken, verifyAccessToken } from "../utils/access-token.js";
import { 
    REFRESH_TTL_MS,
    createRefreshSecret,
    digestRefreshSecret,
    buildRefreshCredential
} from '../utils/refresh-token.js';
import { randomUUID } from 'crypto';



//Restriction for what prisma can return. Example passwordHash
export const safeUserSelect = {
  id: true,
  email: true,
  role: {
    select:{
        name: true
    }
  },
  createdAt: true,
} satisfies Prisma.UserSelect;

//Check if user exists in database
export function checkUser(email: Email){
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            passwordHash: true,
            role: true,
            isActive: true,
            createdAt: true,
        }
    })
};


//Add user to the database and return a safe user information 
export function createUser(email:Email, passwordHash: string, name: string){
    return prisma.user.create({
        data:{
            email,
            passwordHash,
            name,
            role:{
                connect:{
                    name: "USER"
                }
            }
        },
        select: safeUserSelect
    })
};

//check if an error is a unique constraint and prisma known error
export function checkError(error: any){
    const check = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    return check;
};

type UserToken = Prisma.UserGetPayload<{
    select: typeof safeUserSelect
}>

export async function giveToken(user: UserToken){
    const sessionId = randomUUID();
    const refreshSecret = createRefreshSecret();
    const refreshDigest = digestRefreshSecret(refreshSecret);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

    const session = await prisma.authSession.create({
        data: {
            id: sessionId,
            userId: user.id,
            currentRefreshDigest: refreshDigest,
            expiresAt
        }
    });

    const principal = {
        userId: user.id,
        sessionId: sessionId,
        role: user.role.name
    }

    const accessToken = createToken(principal);
    const refreshCredential = buildRefreshCredential(session.id, refreshSecret);

    return {accessToken, refreshCredential};
}
