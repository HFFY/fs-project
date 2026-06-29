import TaskCard from "./TaskCard";

type Task =  {
  id: number;
  text: string;
  completed: boolean;
};

type TaskListProps = {
    tasks: Task[];
    onCompleteTask: (id:number) => void;
    onUncompleteTask: (id:number) => void;
    onDeleteTask: (id:number) => void;
};

function TaskList(props: TaskListProps) {
    return(
        <ul>
            {props.tasks.map((task) => (
                <TaskCard 
                    key={task.id} 
                    id={task.id} 
                    completed={task.completed} 
                    text={task.text} 
                    onCompleteTask={props.onCompleteTask}
                    onUncompleteTask={props.onUncompleteTask}
                    onDeleteTask={props.onDeleteTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;