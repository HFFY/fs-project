require("dotenv/config");

const bcrypt = require("bcrypt");
const { PrismaClient } = require("../src/generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.task.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            text: "Tarea de ejemplo para pruebas",
            completed: false,
        },
    });

    await prisma.$executeRaw`
        SELECT setval(pg_get_serial_sequence('"Task"', 'id'), (SELECT MAX(id) FROM "Task"))
    `;

    await prisma.user.upsert({
        where: { username: "demo" },
        update: {},
        create: {
            username: "demo",
            password: await bcrypt.hash("contrasenaDePrueba999", 10),
        },
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e: unknown) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
