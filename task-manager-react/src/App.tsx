import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import Footer from "./components/Footer";
import EmptyState from "./components/EmptyState";
import { useState } from "react";

type Task =  {
  id: number;
  text: string;
  completed: boolean;
};

function App() { 
  const [tasks, setTaks] = useState<Task[]>([]);

  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: Date.now(),
      text: text,
      completed: false,
    };
    setTaks([...tasks, newTask]);
  };

  const handleCompleteTask = (id: number) => {
    setTaks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  const handleUncompleteTask = (id: number) => {
    setTaks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: false } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTaks(tasks.filter((task) => task.id !== id));
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