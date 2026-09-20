import { Router } from 'express';
import * as controllers from '../controller/auth.controller.js'


const authRouter = Router();

authRouter.post('/register', controllers.registering);




export default authRouter;