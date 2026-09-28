import { Request, Response} from 'express';
import { RoleName } from '../generated/prisma/enums.js';
import * as services from '../services/admin.service.js'
import { BodyInput, IdParamInput } from '../schemas/admin.schemas.js';

export async function changeUserRole(req: Request<IdParamInput, {}, BodyInput>, res: Response){
    const {id} = req.params;
    const {role} = req.body;

    const user = services.roleChange(id, role);

    return res.status(200).json({message: "Role changed!", user});
}