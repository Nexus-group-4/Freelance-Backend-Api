import * as applicationControllers from "../controller/application.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkApplicationOrJobOwnership, checkApplicationOwnership, checkJobOwnership } from "../middleware/ownership.middleware.js"
import { requireAuth } from "../middleware/auth.middleware.js"


export const applicationRouter = Router();
applicationRouter.use(requireAuth)

applicationRouter.get(
    "/me",
    requirePermission("application:read"),
    applicationControllers.getCurrentUserApplications)

applicationRouter.get(
    "/:id",
    checkJobOwnership,
    requirePermission("application:read"),
    applicationControllers.getAllApplications
)


applicationRouter.post(
    "/:jobId",
    requirePermission("application:create"),
    applicationControllers.createApplication
)
applicationRouter.put(
    "/:id",
    requirePermission("application:update"),
    checkApplicationOwnership,
    applicationControllers.editApplication
)
applicationRouter.patch(
    "/:id",
    requirePermission("application:update"),
    checkApplicationOrJobOwnership,
    applicationControllers.editApplicationStatus
)
applicationRouter.delete(
    "/:id",
    requirePermission("application:delete"),
    checkApplicationOwnership,
    applicationControllers.deleteApplication
)

export default applicationRouter
