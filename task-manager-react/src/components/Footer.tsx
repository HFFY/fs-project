import { getTaskStats } from "../utils/taskStats";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type FooterProps = {
  tasks: Task[];
};

function Footer(props: FooterProps) {
  const { total, completed, pending } = getTaskStats(props.tasks);

  return (
    <footer className="footer">
      <p>Total de tareas: {total}</p>
      <p>Tareas pendientes: {pending}</p>
      <p>Tareas completadas: {completed}</p>
    </footer>
  );
}

export default Footer;
