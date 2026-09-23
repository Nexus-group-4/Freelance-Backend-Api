import * as jobControllers from "../controller/job.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkJobOwnership } from "../middleware/ownership.middleware.js"

const router = Router()

router.get("/", jobControllers.getAllJobs)
router.get("/categories", jobControllers.getAllCategories)
router.get("/:id", jobControllers.getJobById)

router.post(
    "/",
    requirePermission("jobs:create"),
    jobControllers.createJob)
router.put(
    "/:id",
    requirePermission("jobs:update"),
    checkJobOwnership,
    jobControllers.editJob)
router.delete(
    "/:id",
    requirePermission("jobs:delete"),
    checkJobOwnership,
    jobControllers.deleteJob)

export default router 