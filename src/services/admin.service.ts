import { prisma } from "../lib/prisma.js";
import { RoleName } from "../generated/prisma/enums.js";

export function roleChange(id: string, role: RoleName){
    const user = prisma.user.update({
        where: { id },
        data: {
            role:{
                connect:{
                    name: role
                }
            }
        }
    });
    return user;
};