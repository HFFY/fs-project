require("dotenv/config");

const { createApp } = require("./app");

const { PrismaClient } = require("./generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const PORT = 3000;

const app = createApp(prisma);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
