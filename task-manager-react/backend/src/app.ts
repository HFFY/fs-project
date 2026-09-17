// Los modulos propios se importan con sintaxis ESM (TS los compila a
// CommonJS igual) para que vitest pueda resolver el archivo .ts.
import { buildTaskUpdate } from "./taskUpdate";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const SALT_ROUNDS = 10;

/**
 * Arma la aplicacion de Express y devuelve el `app` sin ponerlo a escuchar.
 *
 * El cliente de Prisma llega como parametro en lugar de crearse aqui adentro:
 * asi index.ts le pasa el real y los tests le pasan uno falso, sin necesidad
 * de una base de datos ni de levantar un puerto.
 *
 * El secreto del JWT tambien llega desde afuera (index.ts lo lee del entorno),
 * para que nunca quede escrito en el codigo.
 */
export function createApp(prisma: any, config: { jwtSecret: string }) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/", (req: any, res: any) => {
        res.send("Backend is running");
    });

    app.get("/tasks", async (req: any, res: any) => {
        const tasksFromDatabase = await prisma.task.findMany();
        res.json(tasksFromDatabase);
    });

    app.post("/tasks", async (req: any, res: any) => {
        const { text } = req.body || {};
        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Task text is required"
            });
        }
        const newTask = await prisma.task.create({
            data: {
                text: text,
                completed: false
            }
        });
        res.status(201).json(newTask);
    });

    app.put("/tasks/:id", async (req: any, res: any) => {
        const id = Number(req.params.id);
        const { text, completed } = req.body || {};

        const task = await prisma.task.findUnique({
            where: { id: id }
        });
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const dataToUpdate = buildTaskUpdate({ text: text, completed: completed });

        const updatedTask = await prisma.task.update({
            where: { id: id },
            data: dataToUpdate
        });

        res.json(updatedTask);
    });

    app.delete("/tasks/:id", async (req: any, res: any) => {
        const id = Number(req.params.id);

        const taskExists = await prisma.task.findUnique({
            where: { id: id }
        });
        if (!taskExists) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const deletedTask = await prisma.task.delete({
            where: { id: id }
        });

        res.json({
            message: "Task deleted successfully",
            task: deletedTask
        });
    });

    app.get("/profile", (req: any, res: any) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            res.json({
                message: "Protected profile data",
                user: decoded
            });
        } catch (error) {
            res.status(401).json({
                message: "Invalid token"
            });
        }
    });

    app.post("/users", async (req: any, res: any) => {
        const { username, password } = req.body || {};
        if (!username || username.trim() === "" || !password || password.trim() === "") {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username: username }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        });
        res.status(201).json({
            message: "User created successfully",
            username: newUser.username
        });
    });

    app.post("/login", async (req: any, res: any) => {
        const { email, password } = req.body || {};

        const user = await prisma.user.findUnique({
            where: { username: email }
        });

        //Compare the plain password sent by the client against the stored hash.
        const passwordMatches = user
            ? await bcrypt.compare(password, user.password)
            : false;

        if (user && passwordMatches) {
            const token = jwt.sign(
                { email: email },
                config.jwtSecret,
                { expiresIn: "1h" }
            );
            return res.json({
                message: "Login successful",
                token: token
            });
        }
        res.status(401).json({
            message: "Invalid credentials"
        });
    });

    return app;
}
