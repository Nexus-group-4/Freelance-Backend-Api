import * as applicationControllers from "../controller/application.controller.js"
import { Router } from "express"

const router = Router()


router.get("/jobs/:jobId/applications", applicationControllers.getAllApplications)
router.get("/applications/me", applicationControllers.getCurrentUserApplications)
router.post("/jobs/:jobId/applications", applicationControllers.createApplication)
router.put("/applications/:id", applicationControllers.editApplication)
router.patch("/applications/:id/status", applicationControllers.editApplicationStatus)
router.delete("/applications/:id", applicationControllers.deleteApplication)

export default router
