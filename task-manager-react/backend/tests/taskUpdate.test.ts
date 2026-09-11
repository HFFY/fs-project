import { describe, it, expect } from "vitest";
import { buildTaskUpdate } from "../src/taskUpdate";

describe("buildTaskUpdate", () => {
  it("devuelve un objeto vacio cuando el body no trae campos utiles", () => {
    expect(buildTaskUpdate({})).toEqual({});
  });

  it("incluye solo el texto cuando solo llega texto", () => {
    expect(buildTaskUpdate({ text: "Nueva tarea" })).toEqual({
      text: "Nueva tarea",
    });
  });

  it("incluye solo completed cuando solo llega completed", () => {
    expect(buildTaskUpdate({ completed: true })).toEqual({ completed: true });
  });

  it("incluye completed en false (no lo confunde con ausente)", () => {
    expect(buildTaskUpdate({ completed: false })).toEqual({ completed: false });
  });

  it("incluye ambos campos cuando llegan los dos", () => {
    expect(buildTaskUpdate({ text: "Tarea", completed: true })).toEqual({
      text: "Tarea",
      completed: true,
    });
  });

  it("ignora el texto vacio", () => {
    expect(buildTaskUpdate({ text: "" })).toEqual({});
  });

  it("ignora el texto que es solo espacios", () => {
    expect(buildTaskUpdate({ text: "   " })).toEqual({});
  });

  it("conserva el texto sin recortar los espacios de los extremos", () => {
    expect(buildTaskUpdate({ text: "  Tarea  " })).toEqual({
      text: "  Tarea  ",
    });
  });

  it("ignora un texto que no es string en lugar de romperse", () => {
    expect(buildTaskUpdate({ text: null })).toEqual({});
    expect(buildTaskUpdate({ text: 42 })).toEqual({});
  });

  it("ignora un completed que no es booleano", () => {
    expect(buildTaskUpdate({ completed: "true" })).toEqual({});
  });

  it("es pura: no muta el objeto recibido", () => {
    const input = { text: "Tarea", completed: true };
    const copia = structuredClone(input);

    buildTaskUpdate(input);

    expect(input).toEqual(copia);
  });

  it("es pura: la misma entrada siempre da el mismo resultado", () => {
    const input = { text: "Tarea", completed: false };

    expect(buildTaskUpdate(input)).toEqual(buildTaskUpdate(input));
  });

  it("devuelve un objeto nuevo en cada llamada", () => {
    const input = { text: "Tarea" };

    expect(buildTaskUpdate(input)).not.toBe(buildTaskUpdate(input));
  });
});
