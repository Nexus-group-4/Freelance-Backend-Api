import { prisma } from "../../src/lib/prisma.js"
import { createToken } from "../../src/utils/access-token.js"
import type { AuthUser } from "../../src/types/express.js"

export async function cleanDatabase() {
    await prisma.review.deleteMany()
    await prisma.contract.deleteMany()
    await prisma.application.deleteMany()
    await prisma.job.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.authSession.deleteMany()
    await prisma.user.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.permission.deleteMany()
    await prisma.role.deleteMany()
    await prisma.category.deleteMany()
}

export async function seedRolesAndPermissions() {
    const userRole = await prisma.role.create({
        data: { name: "USER" },
    })

    const adminRole = await prisma.role.create({
        data: { name: "ADMIN" },
    })

    const permissionsList = [
        "contract:create",
        "contract:read",
        "contract:update",
    ]

    for (const action of permissionsList) {
        const permission = await prisma.permission.create({
            data: { action },
        })

        await prisma.rolePermission.create({
            data: { roleId: userRole.id, permissionId: permission.id },
        })
        await prisma.rolePermission.create({
            data: { roleId: adminRole.id, permissionId: permission.id },
        })
    }

    return { userRole, adminRole }
}

export async function createTestUser(
    email: string,
    roleName: "USER" | "ADMIN" = "USER",
    permissions: string[] = ["contract:create", "contract:read", "contract:update"]
) {
    let role = await prisma.role.findUnique({ where: { name: roleName } })
    if (!role) {
        role = await prisma.role.create({ data: { name: roleName } })
    }

    for (const action of permissions) {
        let perm = await prisma.permission.findUnique({ where: { action } })
        if (!perm) {
            perm = await prisma.permission.create({ data: { action } })
        }

        const existing = await prisma.rolePermission.findFirst({
            where: { roleId: role.id, permissionId: perm.id },
        })

        if (!existing) {
            await prisma.rolePermission.create({
                data: { roleId: role.id, permissionId: perm.id },
            })
        }
    }

    const user = await prisma.user.create({
        data: {
            name: "Test User",
            email,
            passwordHash: "hashedpassword",
            tokenVersion: 0,
            roleId: role.id,
        },
    })

    const session = await prisma.authSession.create({
        data: {
            userId: user.id,
            currentRefreshDigest: "testdigest",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
    })

    const authUser: AuthUser = {
        userId: user.id,
        email: user.email,
        role: role.name,
        permissions,
        tokenVersion: user.tokenVersion,
    }

    const token = createToken({
        userId: user.id,
        sessionId: session.id,
        role: role.name,
    })

    return { user, token, authUser }
}

export async function seedContractData(
    applicationStatus: "ACCEPTED" | "PENDING" = "ACCEPTED"
) {
    await seedRolesAndPermissions()

    const client = await createTestUser("client@example.com", "USER")
    const freelancer = await createTestUser("freelancer@example.com", "USER")
    const outsider = await createTestUser("outsider@example.com", "USER")

    const category = await prisma.category.create({
        data: { name: "Software Development" },
    })

    const job = await prisma.job.create({
        data: {
            title: "Fullstack App",
            description: "Build a web app",
            budget: 1000,
            clientId: client.user.id,
            categoryId: category.id,
        },
    })

    const application = await prisma.application.create({
        data: {
            proposal: "I can do this",
            proposedRate: 900,
            status: applicationStatus,
            jobId: job.id,
            freelancerId: freelancer.user.id,
        },
    })

    return { client, freelancer, outsider, category, job, application }
}