import { prisma } from '../src/lib/prisma.js';

async function main() {
    await prisma.role.upsert({
        where: { name: "USER" },
        update: {},
        create: { name: "USER" },
    });

    await prisma.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: { name: "ADMIN" },
    });
        console.log("Roles seeded successfully.");
}

main();