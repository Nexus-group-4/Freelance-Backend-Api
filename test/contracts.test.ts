import { describe, it, expect, beforeEach, afterAll } from "vitest"
import request from "supertest"
import app from "../src/app.js"
import { prisma } from "../src/lib/prisma.js"
import { cleanDatabase, seedContractData, } from "./helpers/factory.js"

describe("Contract tests", () => {
    beforeEach(async () => {
        await cleanDatabase()
    })

    afterAll(async () => {
        await cleanDatabase()
        await prisma.$disconnect()
    })

    describe("POST /api/contracts (create contract)", () => {
        it("should allow job owner to create a contract for an ACCEPTED application", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            const response = await request(app)
                .post("/api/contracts")
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    applicationId: application.id,
                    agreedRate: 950,
                })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("id")
            expect(response.body.agreedRate).toBe(950)
            expect(response.body.status).toBe("OFFERED")
        })

        it("should return 400 when application status is not ACCEPTED", async () => {
            const { client, application } = await seedContractData("PENDING")

            const response = await request(app)
                .post("/api/contracts")
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    applicationId: application.id,
                    agreedRate: 950,
                })

            expect(response.status).toBe(400)
        })

        it("should return 409 if a contract already exists for the application", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 950,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .post("/api/contracts")
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    applicationId: application.id,
                    agreedRate: 950,
                })

            expect(response.status).toBe(409)
        })

        it("should return 403 when a non contract owner tries to create a contract", async () => {
            const { outsider, application } = await seedContractData("ACCEPTED")

            const response = await request(app)
                .post("/api/contracts")
                .set("Authorization", `Bearer ${outsider.token}`)
                .send({
                    applicationId: application.id,
                    agreedRate: 950,
                })

            expect(response.status).toBe(403)
        })

        it("should return 401 if unauthenticated", async () => {
            const response = await request(app)
                .post("/api/contracts")
                .send({
                    applicationId: "000000000000000000000000000000000000",
                    agreedRate: 950,
                })

            expect(response.status).toBe(401)
        })
    })

    describe("GET /api/contracts (get all contracts)", () => {
        it("should return contracts relevant to the authenticated user", async () => {
            const { client, freelancer, application } = await seedContractData("ACCEPTED")

            await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const resClient = await request(app)
                .get("/api/contracts")
                .set("Authorization", `Bearer ${client.token}`)

            expect(resClient.status).toBe(200)
            expect(resClient.body.length).toBe(1)

            const resFreelancer = await request(app)
                .get("/api/contracts")
                .set("Authorization", `Bearer ${freelancer.token}`)

            expect(resFreelancer.status).toBe(200)
            expect(resFreelancer.body.length).toBe(1)
        })

        it("should filter contracts by query param", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .get("/api/contracts?status=OFFERED")
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(200)
            expect(response.body.length).toBe(1)

            const emptyResponse = await request(app)
                .get("/api/contracts?status=COMPLETED")
                .set("Authorization", `Bearer ${client.token}`)

            expect(emptyResponse.status).toBe(200)
            expect(emptyResponse.body.length).toBe(0)
        })
    })

    describe("GET /api/contracts/:id (get contract by ID)", () => {
        it("should allow client or freelancer to view contract", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .get(`/api/contracts/${contract.id}`)
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(200)
            expect(response.body.id).toBe(contract.id)
        })

        it("should return 403 when an unrelated user accesses the contract", async () => {
            const { outsider, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .get(`/api/contracts/${contract.id}`)
                .set("Authorization", `Bearer ${outsider.token}`)

            expect(response.status).toBe(403)
        })
    })

    describe("PATCH /api/contracts/:id/respond (sending response to contract)", () => {
        it("should allow a freelancer to accept an OFFERED contract", async () => {
            const { freelancer, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .patch(`/api/contracts/${contract.id}/respond`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({ status: "IN_PROGRESS" })

            expect(response.status).toBe(201)
            expect(response.body.status).toBe("IN_PROGRESS")
        })

        it("should return 403 if client tries to respond to contract instead of freelancer", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .patch(`/api/contracts/${contract.id}/respond`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "IN_PROGRESS" })

            expect(response.status).toBe(403)
        })

        it("should return 400 when status parameter is missing or invalid", async () => {
            const { freelancer, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const noStatusRes = await request(app)
                .patch(`/api/contracts/${contract.id}/respond`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({})

            expect(noStatusRes.status).toBe(400)

            const invalidStatusRes = await request(app)
                .patch(`/api/contracts/${contract.id}/respond`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({ status: "COMPLETED" })

            expect(invalidStatusRes.status).toBe(400)
        })
    })

    describe("PATCH /api/contracts/:id/status (update contract status)", () => {
        it("should allow marking an IN PROGRESS contract as COMPLETED", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "IN_PROGRESS",
                },
            })

            const response = await request(app)
                .patch(`/api/contracts/${contract.id}/status`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "COMPLETED" })

            expect(response.status).toBe(201)
            expect(response.body.status).toBe("COMPLETED")
        })

        it("should return 400 when attempting to mark an OFFERED contract as COMPLETED", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .patch(`/api/contracts/${contract.id}/status`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "COMPLETED" })

            expect(response.status).toBe(400)
        })

        it("should allow cancelling an OFFERED or IN PROGRESS contract", async () => {
            const { client, application } = await seedContractData("ACCEPTED")

            const contract = await prisma.contract.create({
                data: {
                    applicationId: application.id,
                    agreedRate: 900,
                    status: "OFFERED",
                },
            })

            const response = await request(app)
                .patch(`/api/contracts/${contract.id}/status`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "CANCELLED" })

            expect(response.status).toBe(201)
            expect(response.body.status).toBe("CANCELLED")
        })
    })
}) 