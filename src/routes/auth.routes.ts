import { Router } from 'express';
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from '../middleware/auth.middleware.js';
import * as controllers from '../controller/auth.controller.js';
import * as OControllers from '../controller/oauth.controller.js';
import { registerSchema, loginSchema } from '../schemas/auth.schemas.js';
import { asyncHandler } from "../utils/async-handler.js";
import { checkUserOwnership } from '../middleware/ownership.middleware.js';

const authRouter = Router();

authRouter.get('/google', asyncHandler(OControllers.googleLogin));

authRouter.get('/google/callback', asyncHandler(OControllers.callback));

authRouter.post('/register', validate(registerSchema),asyncHandler(controllers.registering));

authRouter.post('/login', validate(loginSchema), asyncHandler(controllers.loging));

authRouter.post('/refresh', asyncHandler(controllers.refresh));

authRouter.post('/logout', controllers.logout);

authRouter.post('/logout-all', checkUserOwnership, controllers.logoutAll);

export default authRouter;