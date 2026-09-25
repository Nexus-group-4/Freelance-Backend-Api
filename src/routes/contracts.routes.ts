import * as contractControllers from "../controller/contract.controller.js"
import { Router } from "express"
import { requirePermission } from "../middleware/permission.middleware.js"
import { checkApplicationOrJobOwnership, checkApplicationOwnership, checkContractOwnership, checkJobOwnership } from "../middleware/ownership.middleware.js"

const router = Router()

// Only the job owner can  create contract
router.post(
    "/",
    requirePermission("contract:create"),
    checkJobOwnership,
    contractControllers.createContract
)

router.get(
    "/",
    requirePermission("contract:read"),
    contractControllers.getAllContracts
)

router.get(
    "/:id",
    requirePermission("contract:read"),
    checkContractOwnership,
    contractControllers.getContractById
)

router.patch(
    "/:id/respond",
    requirePermission("contract:update"),
    checkContractOwnership,
    contractControllers.respondToContract
)

router.patch(
    "/:id/status",
    requirePermission("contract:update"),
    checkContractOwnership,
    contractControllers.updateContract
)