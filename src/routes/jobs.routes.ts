import * as jobControllers from "../controller/job.controller.js"
import { Router } from "express"

const router = Router()

router.get("/", jobControllers.getAllJobs)
router.get("/:id", jobControllers.getJobById)
router.get("/categories", jobControllers.getAllCategories)
router.post("/", jobControllers.createJob)
router.put("/:id", jobControllers.editJob)
router.delete("/:id", jobControllers.deleteJob)

export default router 