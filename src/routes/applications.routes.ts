import * as applicationControllers from "../controller/application.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkApplicationOrJobOwnership, checkApplicationOwnership, checkJobOwnership } from "../middleware/ownership.middleware.js"

const router = Router()


router.get(
    "/jobs/:jobId/applications",
    checkJobOwnership,
    requirePermission("application"),
    applicationControllers.getAllApplications
)

router.get(
    "/applications/me",
    requirePermission("application:read"),
    applicationControllers.getCurrentUserApplications)

router.post(
    "/jobs/:jobId/applications",
    requirePermission("application:create"),
    applicationControllers.createApplication
)
router.put(
    "/applications/:id",
    requirePermission("application:update"),
    checkApplicationOwnership,
    applicationControllers.editApplication
)
router.patch(
    "/applications/:id/status",
    requirePermission("application:update"),
    checkApplicationOrJobOwnership,
    applicationControllers.editApplicationStatus
)
router.delete(
    "/applications/:id",
    requirePermission("application:delete"),
    checkApplicationOwnership,
    applicationControllers.deleteApplication
)

export default router
