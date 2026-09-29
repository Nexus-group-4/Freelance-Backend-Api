
import { cleanDatabase, seedJobData } from "./helpers/factory";
import { prisma } from "../src/lib/prisma.js"
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../src/app.js"
import request from "supertest"

describe("Job tests", () => {
    beforeEach(async () => {
        await cleanDatabase()
    })
    afterAll(async () => {
        await cleanDatabase()
        await prisma.$disconnect()
    })

    describe("GET /api/jobs (get all jobs)", () => {
        it("should get all jobs", async () => {
            const { client, category } = await seedJobData()

            await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .get("/api/jobs")
                .set("Authorization", `Bearer ${client.token}`)


            expect(response.status).toBe(200)
            expect(response.body.length).toBe(1)

        })

        it("should get all jobs", async () => {
            const { client, category } = await seedJobData()

            await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .get("/api/jobs?status=CLOSED")
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(200)
            expect(response.body.length).toBe(0)
        })

    })
    describe("GET /api/jobs/:id (get job by id)", () => {
        it("should retrieve a job by its id", async () => {
            const { client, category } = await seedJobData()

            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .get(`/api/jobs/${job.id}`)
                .set("Authorization", `Bearer ${client.token}`)


            expect(response.status).toBe(200)
            expect(response.body.id).toBe(job.id)
        })
    })
    describe("POST /api/jobs (create a job)", () => {
        it("should let an authenticated user to create a job", async () => {
            const { client, category } = await seedJobData()
            const response = await request(app)
                .post("/api/jobs")
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("id")
            expect(response.body.budget).toBe(1000)
            expect(response.body.status).toBe("OPEN")
        })

        it("should return 401 if unauthenticated", async () => {
            const { client, category } = await seedJobData()

            const response = await request(app)
                .post("/api/jobs")
                .send({
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                })

            expect(response.status).toBe(401)
        })
    })
    describe("PUT /api/jobs/:id (edit a job)", () => {
        it("should allow a job owner to edit a job", async () => {
            const { client, category } = await seedJobData()

            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .put(`/api/jobs/${job.id}`)
                .set("Authorization", `Bearer ${client.token}`)
                .send({
                    status: "CLOSED",
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                })


            expect(response.status).toBe(200)
            expect(response.body.status).toBe("CLOSED")

        })
        it("should return 403 if a non job owner tries to edit a job", async () => {
            const { client, category, outsider } = await seedJobData()

            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .put(`/api/jobs/${job.id}`)
                .set("Authorization", `Bearer ${outsider.token}`)
                .send({
                    status: "CLOSED",
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                })


            expect(response.status).toBe(403)

        })
        it("should return 401 if unauthenticated", async () => {
            const { client, category } = await seedJobData()
            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })
            const response = await request(app)
                .put(`/api/jobs/${job.id}`)
                .send({
                    status: "CLOSED",
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                })

            expect(response.status).toBe(401)
        })

    })
    describe("DELETE /api/jobs/:id (delete a job)", () => {
        it("should allow a job owner to delte a job", async () => {
            const { client, category } = await seedJobData()

            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .delete(`/api/jobs/${job.id}`)
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(200)

            const deletedJob = await prisma.job.findUnique({
                where: { id: job.id },
            })
            expect(deletedJob).toBeNull()

        })
        it("should return 403 if a non job owner tries to delete a job", async () => {
            const { client, category, outsider } = await seedJobData()

            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })

            const response = await request(app)
                .delete(`/api/jobs/${job.id}`)
                .set("Authorization", `Bearer ${outsider.token}`)


            expect(response.status).toBe(403)

        })
        it("should return 401 if unauthenticated", async () => {
            const { client, category } = await seedJobData()
            const job = await prisma.job.create({
                data: {
                    title: "Fullstack App",
                    description: "Build a web app",
                    budget: 1000,
                    clientId: client.user.id,
                    categoryId: category.id,
                },
            })
            const response = await request(app)
                .delete(`/api/jobs/${job.id}`)


            expect(response.status).toBe(401)
        })
        it("should return 404 if the job does not exist", async () => {
            const { client } = await seedJobData()


            const response = await request(app)
                .delete(`/api/jobs/50`)
                .set("Authorization", `Bearer ${client.token}`)

            expect(response.status).toBe(404)
        });

    })

})