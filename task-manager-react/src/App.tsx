import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import Footer from "./components/Footer";
import EmptyState from "./components/EmptyState";
import { useEffect, useState } from "react";

type Task =  {
  id: number;
  text: string;
  completed: boolean;
};

function App() { 
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
        const response = await fetch("http://localhost:3000/tasks");
        const data = await response.json();
        setTasks(data);
    };
    fetchTasks();
}, []);

  const handleAddTask = async (text: string) => {
    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
};

  const handleCompleteTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  const handleUncompleteTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: false } : task
      )
    );
  };

  const handleDeleteTask = async (id: number) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        return;
    }
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app-container">
      <Header />
      <TaskInput onAddTask={handleAddTask} />
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskList tasks={tasks} onCompleteTask={handleCompleteTask} onUncompleteTask={handleUncompleteTask} onDeleteTask={handleDeleteTask}/>
      )}
      <Footer tasks={tasks} />
    </div>
  )
} 
export default App; 