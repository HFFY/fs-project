import Header from "../components/Header";
import TaskList from "../components/TaskList";
import TaskInput from "../components/TaskInput";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:3000/tasks");
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    // Pide el perfil con el token guardado al iniciar sesión para saludar
    // por su nombre. Si no hay token, falla la petición o el usuario es
    // antiguo y no registró nombre, el saludo queda como "Bienvenido".
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) return;
        const data = await response.json();
        setFirstName(data.user?.firstName ?? "");
      } catch {
        // Sin conexión: se muestra el saludo genérico.
      }
    };
    fetchProfile();
  }, []);

  const handleAddTask = async (text: string) => {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const handleCompleteTask = async (id: number) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: true,
      }),
    });
    if (!response.ok) {
      return;
    }
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const handleUncompleteTask = async (id: number) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: false,
      }),
    });
    if (!response.ok) {
      return;
    }
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const handleDeleteTask = async (id: number) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return;
    }
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app-container">
      <h1 className="welcome-title">
        {firstName ? `Bienvenido ${firstName}` : "Bienvenido"}
      </h1>
      <Header />
      <TaskInput onAddTask={handleAddTask} />
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskList
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onUncompleteTask={handleUncompleteTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
      <Footer tasks={tasks} />
    </div>
  );
}

export default HomePage;
