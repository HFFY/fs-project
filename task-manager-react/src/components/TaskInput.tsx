import { useState } from "react";

type TaskInputProps = {
  onAddTask: (text: string) => void;
};

function TaskInput(props: TaskInputProps) {
  const [text, setText] = useState("");

  const handleClick = () => {
    if (text.trim() === "") return;
    props.onAddTask(text);
    setText("");
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe una tarea"
      />
      <button onClick={handleClick}>Agregar</button>
    </div>
  );
}

export default TaskInput;
