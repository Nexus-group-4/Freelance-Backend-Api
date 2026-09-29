import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { cleanDatabase, seedApplicationData } from "./helpers/factory";
import { prisma } from "../src/lib/prisma";
import request from "supertest"
import app from "../src/app";

describe("Application tests", () => {
    beforeEach(async () => {
        await cleanDatabase()
    })

    afterAll(async () => {
        await cleanDatabase()
        await prisma.$disconnect()
    })

    describe("GET api/jobs/:jobId/applications (get all applications for a job)", () => {
        it("should retireive all applications of a job for the job owner", async () => {
            const { client, job, freelancer } = await seedApplicationData()
            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            console.log(client.user.id, job.clientId)


            const response = await request(app)
                .get(`/api/applications/${job.id}`)
                .set("Authorization", `Bearer ${client.token}`)
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(1)

        })
        it("should return 403 if non job owner tries to get all applications for a job", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            const response = await request(app)
                .get(`/api/applications/${job.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)

            expect(response.status).toBe(403)

        })
        it("should return 401 if user isnt authenticated", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            const response = await request(app)
                .get(`/api/applications/${job.id}`)

            expect(response.status).toBe(401)
        })
        it("should return 404 if jobId doesnt exist", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            const response = await request(app)
                .get(`/api/applications/300`)
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(404)
        })
    })
    describe("GET /api/applications/me", () => {
        it("should get all applications associated with current user", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            const response = await request(app)
                .get(`/api/applications/me`)
                .set("Authorization", `Bearer ${freelancer.token}`)

            expect(response.status).toBe(200)
            expect(response.body.length).toBe(1)

        })
        it("should return 401 if user isnt authenticated", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            const response = await request(app)
                .get(`/api/applications/${job.id}`)

            expect(response.status).toBe(401)
        })
    })
    describe("POST /api/jobs/:jobId/applications", () => {
        it("should return 401 if user isnt authenticated", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                }
            })

            const response = await request(app)
                .post(`/api/applications/${job.id}`)

            expect(response.status).toBe(401)
        })
        it("should allow a user to send an application for a job", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            const response = await request(app)
                .post(`/api/applications/${job.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                    proposal: "I can do this",
                    proposedRate: 900,
                })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("id")
            expect(response.body.proposedRate).toBe(900)
            expect(response.body.status).toBe("PENDING")

        })
        it("should return 404 if jobId doesnt exist", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            const response = await request(app)
                .post(`/api/applications/400`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                    proposal: "I can do this",
                    proposedRate: 900,
                })
            expect(response.status).toBe(404)
        })
        it("should return 400 if fields are missing from the input", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            const response = await request(app)
                .post(`/api/applications/${job.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                    proposal: "I can do this",
                })

            expect(response.status).toBe(400)
        })
        it("should return 400 if user has already applied to job", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            await prisma.application.create({
                data: {
                    proposal: "I can do this",
                    proposedRate: 900,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })
            const response = await request(app)
                .post(`/api/applications/${job.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                    proposal: "I can do this",
                    proposedRate: 900,
                })

            expect(response.status).toBe(400)
        })
        it("should return 403 if job owner tries to apply to their own job", async () => {
            const { client, job, freelancer } = await seedApplicationData()

            const response = await request(app)
                .post(`/api/applications/${job.id}`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                    proposal: "I can do this",
                    proposedRate: 900,
                })

            expect(response.status).toBe(403)
        })
    })

    describe("PUT /api/applications/:id", () => {
        it("should return 401 if user isnt authenticated", async () => {
            const { job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .put(`/api/applications/${application.id}`)
                .send({
                    proposal: "Updated proposal",
                    proposedRate: 600
                })

            expect(response.status).toBe(401)
        })

        it("should retrun 403 if user isnt owner of application", async () => {
            const { client, job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .put(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    proposal: "Updated proposal",
                    proposedRate: 600
                })

            expect(response.status).toBe(403)
        })

        it("should return 404 if applicationId doesnt exist", async () => {
            const { freelancer } = await seedApplicationData()

            const response = await request(app)
                .put("/api/applications/300")
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({ proposal: "Updated proposal", proposedRate: 600 })

            expect(response.status).toBe(404)
        })


        it("should allow user to edit application", async () => {
            const { job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })



            const response = await request(app)
                .put(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({
                    proposal: "Updated proposal",
                    proposedRate: 900
                })
            console.log(response.error)

            expect(response.status).toBe(200)
            expect(response.body.proposal).toBe("Updated proposal")
            expect(response.body.proposedRate).toBe(900)
        })
    })

    describe("PATCH /api/applications/:id/status", () => {
        it("should return 401 if user isnt authenticated", async () => {
            const { job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .patch(`/api/applications/${application.id}`)
                .send({ status: "ACCEPTED" })

            expect(response.status).toBe(401)
        })

        it("should retrun 403 if user isnt either job owner or application owner", async () => {
            const { job, freelancer, outsider } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })


            const response = await request(app)
                .patch(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${outsider.token}`)
                .send({ status: "ACCEPTED" })

            expect(response.status).toBe(403)
        })

        it("should return 403 if user is job owner and status is WITHDRAWN", async () => {
            const { client, job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .patch(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "WITHDRAWN" })

            expect(response.status).toBe(403)
        })

        it("should return 403 if user is application owner and status is ACCEPTED or REJECTED", async () => {
            const { job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .patch(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)
                .send({ status: "ACCEPTED" })

            expect(response.status).toBe(403)
        })

        it("should return 404 if applicationId doesnt exist", async () => {
            const { client } = await seedApplicationData()

            const response = await request(app)
                .patch("/api/applications/500")
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "ACCEPTED" })

            expect(response.status).toBe(404)
        })

        it("should return 400 if status is not valid", async () => {
            const { client, job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .patch(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "INVALID STATUS" })

            expect(response.status).toBe(400)
        })

        it("should allow user to edit status of application", async () => {
            const { client, job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .patch(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({ status: "ACCEPTED" })

            expect(response.status).toBe(200)
            expect(response.body.status).toBe("ACCEPTED")
        })
    })

    describe("DELETE /api/applications/:id", () => {
        it("should return 401 if user isnt authenticated", async () => {
            const { job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .delete(`/api/applications/${application.id}`)

            expect(response.status).toBe(401)
        })

        it("should retrun 403 if user isnt application owner", async () => {
            const { client, job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .delete(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(403)
        })

        it("should return 404 if applicationId doesnt exist", async () => {
            const { freelancer } = await seedApplicationData()

            const response = await request(app)
                .delete("/api/applications/900")
                .set("Authorization", `Bearer ${freelancer.token}`)

            expect(response.status).toBe(404)
        })

        it("should allow user to delete an application", async () => {
            const { job, freelancer } = await seedApplicationData()
            const application = await prisma.application.create({
                data: {
                    proposal: "Original proposal",
                    proposedRate: 500,
                    jobId: job.id,
                    freelancerId: freelancer.user.id,
                },
            })

            const response = await request(app)
                .delete(`/api/applications/${application.id}`)
                .set("Authorization", `Bearer ${freelancer.token}`)

            expect(response.status).toBe(204)

            const deletedRecord = await prisma.application.findUnique({
                where: { id: application.id },
            })
            expect(deletedRecord).toBeNull()
        })
    })

})