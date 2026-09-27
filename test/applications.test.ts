
import { cleanDatabase } from "./helpers/factory";
import { prisma } from "../src/lib/prisma.js"
import { afterAll, beforeEach, describe, it } from "vitest";
import app from "../src/app.js"

describe("Application tests", () => {
    beforeEach(async () => {
        await cleanDatabase()
    })
    afterAll(async () => {
        await cleanDatabase()
        await prisma.$disconnect()
    })

    describe("GET /jobs/:jobId/applications (get all applications for a job)", () => {
        it("should get all applications for a job for the job owner", async () => {

        })
    })

})