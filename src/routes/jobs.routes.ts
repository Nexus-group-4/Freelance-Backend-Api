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
    requirePermission("jobs:create"),
    jobControllers.createJob)
jobRouter.put(
    "/:id",
    requirePermission("jobs:update"),
    checkJobOwnership,
    jobControllers.editJob)
jobRouter.delete(
    "/:id",
    requirePermission("jobs:delete"),
    checkJobOwnership,
    jobControllers.deleteJob)

export default jobRouter 