import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { checkJobOwnership, checkApplicationOwnership, checkUserOwnership } from "../middleware/ownership.middleware.js"
import { idSchema, changeRoleSchema } from "../schemas/admin.schemas.js";
import { updateApplicationSchema } from "../schemas/application.schemas.js";
import { getUsers, updateCurrentUser, deleteCurrentUser } from "../controller/user.controller.js";
import { editApplication, deleteApplication } from "../controller/application.controller.js";
import { changeUserRole } from "../controller/admin.controller.js";
import { deleteJob } from "../controller/job.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get('/users', checkUserOwnership, asyncHandler(getUsers));

adminRouter.put('/users/:id', checkUserOwnership, validate(idSchema), asyncHandler(updateCurrentUser));

adminRouter.patch('/users/:id/role', checkUserOwnership, validate(changeRoleSchema),changeUserRole);

adminRouter.patch('/application/:id', checkApplicationOwnership, validate(updateApplicationSchema), editApplication);

adminRouter.delete('/user/:id', checkUserOwnership, validate(idSchema), asyncHandler(deleteCurrentUser));

adminRouter.delete('/job/:id', checkJobOwnership, validate(idSchema), deleteJob);

adminRouter.delete('/application/:id', checkApplicationOwnership, validate(idSchema), deleteApplication);

export default adminRouter;