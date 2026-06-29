
type TaskCardProps =  {
  id: number;
  text: string;
  completed: boolean;
  onCompleteTask: (id:number) => void;
  onUncompleteTask: (id:number) => void;
  onDeleteTask: (id:number) => void;
}

function TaskCard(props: TaskCardProps) {

  const handleCompleteClick = () => {
    props.onCompleteTask(props.id);
  };

  const handleUncompleteClick = () => {
    props.onUncompleteTask(props.id);
  };

  const handleDeleteClick = () => {
    props.onDeleteTask(props.id);
  };

    return (
      <li className="task-card">
        <p className="task-text">{props.text}</p>
        <div className="task-actions">
          {props.completed ? (
            <>
              <span className="task-completed">Tarea Completada</span>
              <button onClick={handleUncompleteClick}>Marcar como pendiente</button>
            </>
          ) : (
            <button onClick={handleCompleteClick}>Completar</button>
          )}
          <button onClick={handleDeleteClick}>Eliminar</button>
        </div>
      </li>
    );
}
export default TaskCard;
