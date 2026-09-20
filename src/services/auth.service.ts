import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { Password,Email } from '../schemas/auth.schemas.js';
import { hashPassword } from '../utils/password.js';

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
        select: safeUserSelect
    })
};

//Hash a plain text password
export function hashing(password: Password): Promise<string>{
    return hashPassword(password);
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
export function chechError(error: any){
    const check = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    return check;
};

