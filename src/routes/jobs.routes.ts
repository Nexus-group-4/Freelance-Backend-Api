import * as jobControllers from "../controller/job.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkJobOwnership } from "../middleware/ownership.middleware.js"
import { requireAuth } from "../middleware/auth.middleware.js"

const jobRouter = Router()
jobRouter.use(requireAuth)

jobRouter.get("/", jobControllers.getAllJobs)
jobRouter.get("/categories", jobControllers.getAllCategories)
jobRouter.get("/:id", jobControllers.getJobById)

jobRouter.post(
    "/",
    requireAuth,
    requirePermission("jobs:create"),
    jobControllers.createJob)
jobRouter.put(
    "/:id",
    requireAuth,
    requirePermission("jobs:update"),
    checkJobOwnership,
    jobControllers.editJob)
jobRouter.delete(
    "/:id",
    requireAuth,
    requirePermission("jobs:delete"),
    checkJobOwnership,
    jobControllers.deleteJob)

export default jobRouter 