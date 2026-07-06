require("dotenv/config");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

// PRISMA CHANGE: Import Prisma Client
const { PrismaClient } = require("./generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// PRISMA CHANGE: Create the connection to PostgreSQL through Prisma
const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.use(express.json());

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

const tasks: Task[] = [
    {id:0, text:"Estudiar Node.js", completed:false},
    {id:1, text:"Crear servidor Express", completed:true},
    {id:2, text:"Probar las rutas de BE", completed:false}
];

// PRISMA CHANGE: GET /tasks now reads from PostgreSQL instead of the array
app.get("/tasks", async (req: any, res: any) => {
	const tasksFromDatabase = await prisma.task.findMany();
	res.json(tasksFromDatabase);
});

// NEW JWT CHANGE: This is a protected route. 
// // NEW JWT CHANGE: The user must send a valid token to access this route. 
app.get("/profile", (req: any, res: any) => {    
    // NEW JWT CHANGE: The token is expected in the Authorization header.    
    const authHeader = req.headers.authorization;    
    if (!authHeader) {        
        return res.status(401).json({            
            message: "No token provided"        
        });    
    }    
    // NEW JWT CHANGE: The header usually looks like "Bearer token_here".    
    // // NEW JWT CHANGE: We split it and take only the token part.    
    const token = authHeader.split(" ")[1];    
    try {        
        // NEW JWT CHANGE: jwt.verify checks if the token is valid.        
        const decoded = jwt.verify(token, "secret_key");        
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

// PRISMA CHANGE: DELETE /tasks/:id now removes the row from PostgreSQL
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

app.get("/", (req: any, res:any)=>{
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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

// JWT: This is a basic login route.
// JWT: For now, we are using fixed credentials only for practice.
app.post("/login", (req: any, res: any) => {
    const { email, password } = req.body || {};
    if (email === "admin@test.com" && password === "123456") {
        // JWT: If the credentials are correct, we create a token.
        const token = jwt.sign(
            // JWT: This is the information stored inside the token.
            { email: email },
            // JWT: This secret is used to sign the token.
            "secret_key",
            // JWT: The token will expire in 1 hour.
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

// PRISMA CHANGE: PUT /tasks/:id now updates the row in PostgreSQL
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

    const dataToUpdate: { text?: string; completed?: boolean } = {};
    if (text !== undefined && text.trim() !== "") {
        dataToUpdate.text = text;
    }
    if (completed !== undefined) {
        dataToUpdate.completed = completed;
    }

    const updatedTask = await prisma.task.update({
        where: { id: id },
        data: dataToUpdate
    });

    res.json(updatedTask);
});