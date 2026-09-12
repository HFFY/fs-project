import { describe, it, expect } from "vitest";
import { getTaskStats } from "./taskStats";

describe("getTaskStats", () => {
  it("devuelve todo en cero cuando no hay tareas", () => {
    expect(getTaskStats([])).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
    });
  });

  it("cuenta completadas y pendientes por separado", () => {
    const tasks = [
      { id: 1, text: "Estudiar Node.js", completed: false },
      { id: 2, text: "Crear servidor Express", completed: true },
      { id: 3, text: "Probar las rutas de BE", completed: false },
    ];

    expect(getTaskStats(tasks)).toEqual({
      total: 3,
      completed: 1,
      pending: 2,
    });
  });

  it("cuenta todas como completadas cuando ninguna esta pendiente", () => {
    const tasks = [
      { id: 1, text: "Tarea A", completed: true },
      { id: 2, text: "Tarea B", completed: true },
    ];

    expect(getTaskStats(tasks)).toEqual({
      total: 2,
      completed: 2,
      pending: 0,
    });
  });

  it("cuenta todas como pendientes cuando ninguna esta completada", () => {
    const tasks = [
      { id: 1, text: "Tarea A", completed: false },
      { id: 2, text: "Tarea B", completed: false },
    ];

    expect(getTaskStats(tasks)).toEqual({
      total: 2,
      completed: 0,
      pending: 2,
    });
  });

  it("es pura: no muta el arreglo recibido", () => {
    const tasks = [
      { id: 1, text: "Tarea A", completed: true },
      { id: 2, text: "Tarea B", completed: false },
    ];
    const copia = structuredClone(tasks);

    getTaskStats(tasks);

    expect(tasks).toEqual(copia);
  });

  it("es pura: la misma entrada siempre da el mismo resultado", () => {
    const tasks = [
      { id: 1, text: "Tarea A", completed: true },
      { id: 2, text: "Tarea B", completed: false },
    ];

    expect(getTaskStats(tasks)).toEqual(getTaskStats(tasks));
  });

  it("mantiene la invariante total = completadas + pendientes", () => {
    const tasks = [
      { id: 1, text: "Tarea A", completed: true },
      { id: 2, text: "Tarea B", completed: false },
      { id: 3, text: "Tarea C", completed: true },
      { id: 4, text: "Tarea D", completed: false },
      { id: 5, text: "Tarea E", completed: true },
    ];

    const stats = getTaskStats(tasks);

    expect(stats.completed + stats.pending).toBe(stats.total);
  });
});
