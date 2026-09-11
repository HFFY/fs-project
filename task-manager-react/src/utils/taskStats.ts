/**
 * Funcion pura: el resultado depende unicamente del arreglo recibido.
 * No lee estado externo, no muta `tasks` y no produce efectos secundarios.
 */

// Solo necesitamos el campo `completed`, asi la funcion sirve para
// cualquier forma de tarea que lo tenga.
type CompletableTask = {
  completed: boolean;
};

export type TaskStats = {
  total: number;
  completed: number;
  pending: number;
};

export function getTaskStats(tasks: CompletableTask[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  return {
    total: total,
    completed: completed,
    pending: total - completed,
  };
}
