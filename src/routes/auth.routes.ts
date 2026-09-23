import { Router } from 'express';
import * as controllers from '../controller/auth.controller.js'


const authRouter = Router();

authRouter.post('/register', controllers.registering);

authRouter.post('/login', controllers.loging);



export default authRouter;