import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "../components/TaskList";

function renderLista(tasks: { id: number; text: string; completed: boolean }[]) {
  const onCompleteTask = vi.fn();
  const onUncompleteTask = vi.fn();
  const onDeleteTask = vi.fn();
  render(
    <TaskList
      tasks={tasks}
      onCompleteTask={onCompleteTask}
      onUncompleteTask={onUncompleteTask}
      onDeleteTask={onDeleteTask}
    />
  );
  return { onCompleteTask, onUncompleteTask, onDeleteTask };
}

describe("TaskList", () => {
  it("una tarea pendiente permite completarla y eliminarla", async () => {
    const user = userEvent.setup();
    const { onCompleteTask, onUncompleteTask, onDeleteTask } = renderLista([
      { id: 7, text: "Comprar pan", completed: false },
    ]);

    expect(screen.getByText("Comprar pan")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Completar" }));
    expect(onCompleteTask).toHaveBeenCalledWith(7);

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(onDeleteTask).toHaveBeenCalledWith(7);

    expect(onUncompleteTask).not.toHaveBeenCalled();
  });

  it("una tarea completada muestra la etiqueta y permite volverla a pendiente", async () => {
    const user = userEvent.setup();
    const { onCompleteTask, onUncompleteTask } = renderLista([
      { id: 3, text: "Estudiar", completed: true },
    ]);

    expect(screen.getByText("Tarea Completada")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Completar" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Marcar como pendiente" }));
    expect(onUncompleteTask).toHaveBeenCalledWith(3);
    expect(onCompleteTask).not.toHaveBeenCalled();
  });
});
