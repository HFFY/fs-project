// prisma/seed.ts
//
// Seed reproducible: usa upsert, asi que correrlo varias veces seguidas no
// falla ni duplica datos. Se ejecuta con `npx prisma db seed` (Prisma 7 lo
// toma de migrations.seed en prisma.config.ts, no de package.json).
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

    // Insertar un id fijo no avanza la secuencia SERIAL de "Task": sin esto,
    // el primer POST /tasks intentaria usar id 1 y fallaria con
    // "Unique constraint failed".
    await prisma.$executeRaw`
        SELECT setval(pg_get_serial_sequence('"Task"', 'id'), (SELECT MAX(id) FROM "Task"))
    `;

    // Usuario de demostracion con una contrasena obviamente ficticia.
    // update: {} evita volver a hashearla en cada corrida.
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
