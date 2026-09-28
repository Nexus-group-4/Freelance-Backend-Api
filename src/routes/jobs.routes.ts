import * as jobControllers from "../controller/job.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkJobOwnership } from "../middleware/ownership.middleware.js"
import { requireAuth } from "../middleware/auth.middleware.js"

<<<<<<< HEAD
const router = Router()
router.get("/", jobControllers.getAllJobs)
router.get("/categories", jobControllers.getAllCategories)
router.get("/:id", jobControllers.getJobById)
=======
const jobRouter = Router()
jobRouter.use(requireAuth)

jobRouter.get("/", jobControllers.getAllJobs)
jobRouter.get("/categories", jobControllers.getAllCategories)
jobRouter.get("/:id", jobControllers.getJobById)
>>>>>>> eea2b86209ef6b2be5e7986713ea567cea0f3d69

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