const express = require("express");

const app = express();
const PORT = 3000;

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

app.get("/tasks",(req:any, res:any)=>{
    res.json(tasks);
});

app.delete("/tasks/:id", (req: any, res:any)=>{
    const id = Number(req.params.id);
    const taskExists = tasks.some((task)=> task.id === id);
    if(!taskExists){
        return res.status(404).json({
            message: "Task not found"
        });
    }
    const updateTasks = tasks.filter((task) => task.id !== id);
    tasks.length = 0;
    tasks.push(...updateTasks);

    res.json({
        message:"Task deleted succesfully",
        tasks: tasks
    });
});

app.get("/", (req: any, res:any)=>{
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/tasks", (req: any, res: any)=>{
    const {text} = req.body;
    if(!text || text.trim() === ""){
        return res.status(400).json({
            message: "Task text is required"
        });
    }
    const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };    
    tasks.push(newTask);    
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: any, res: any) => {    
    const id = Number(req.params.id);    
    const { text, completed } = req.body;    
    const task = tasks.find((task) => task.id === id);    
    if (!task) {        
        return res.status(404).json({            
            message: "Task not found"        
        });    
    }    
    if (text !== undefined && text.trim() !== "") {        
        task.text = text;    
    }    
    if (completed !== undefined) {        
        task.completed = completed;    
    }    
    res.json(task); 
});