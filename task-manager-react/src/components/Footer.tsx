type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type FooterProps = {
  tasks: Task[];
};

function Footer(props: FooterProps) {
  const total = props.tasks.length;
  const completed = props.tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  return (
    <footer className="footer">
      <p>Total de tareas: {total}</p>
      <p>Tareas pendientes: {pending}</p>
      <p>Tareas completadas: {completed}</p>
    </footer>
  );
}

export default Footer;
