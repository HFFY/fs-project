require("dotenv/config");

const { createApp } = require("./app");
const { loadConfig } = require("./config");

const { PrismaClient } = require("./generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const config = loadConfig();

const adapter = new PrismaPg({
	connectionString: config.databaseUrl,
});
const prisma = new PrismaClient({ adapter });

const app = createApp(prisma, { jwtSecret: config.jwtSecret });

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
