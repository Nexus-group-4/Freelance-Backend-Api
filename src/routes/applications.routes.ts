import * as applicationControllers from "../controller/application.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkApplicationOrJobOwnership, checkApplicationOwnership, checkJobOwnership } from "../middleware/ownership.middleware.js"
import { requireAuth } from "../middleware/auth.middleware.js"
<<<<<<< HEAD

const router = Router()
router.use(requireAuth)
=======
>>>>>>> eea2b86209ef6b2be5e7986713ea567cea0f3d69


const applicationRouter = Router()

applicationRouter.use(requireAuth)


applicationRouter.get(
    "/jobs/:jobId/applications",
    checkJobOwnership,
    requirePermission("application"),
    applicationControllers.getAllApplications
)

applicationRouter.get(
    "/applications/me",
    requirePermission("application:read"),
    applicationControllers.getCurrentUserApplications)

applicationRouter.post(
    "/jobs/:jobId/applications",
    requirePermission("application:create"),
    applicationControllers.createApplication
)
applicationRouter.put(
    "/applications/:id",
    requirePermission("application:update"),
    checkApplicationOwnership,
    applicationControllers.editApplication
)
applicationRouter.patch(
    "/applications/:id/status",
    requirePermission("application:update"),
    checkApplicationOrJobOwnership,
    applicationControllers.editApplicationStatus
)
applicationRouter.delete(
    "/applications/:id",
    requirePermission("application:delete"),
    checkApplicationOwnership,
    applicationControllers.deleteApplication
)

export default applicationRouter
