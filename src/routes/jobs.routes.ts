import * as jobControllers from "../controller/job.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkJobOwnership } from "../middleware/ownership.middleware.js"
import { requireAuth } from "../middleware/auth.middleware.js"

const router = Router()
router.get("/", jobControllers.getAllJobs)
router.get("/categories", jobControllers.getAllCategories)
router.get("/:id", jobControllers.getJobById)

router.post(
    "/",
    requireAuth,
    requirePermission("jobs:create"),
    jobControllers.createJob)
router.put(
    "/:id",
    requireAuth,
    requirePermission("jobs:update"),
    checkJobOwnership,
    jobControllers.editJob)
router.delete(
    "/:id",
    requireAuth,
    requirePermission("jobs:delete"),
    checkJobOwnership,
    jobControllers.deleteJob)

export default router 