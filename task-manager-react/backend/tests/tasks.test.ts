// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

/**
 * Prisma falso: solo implementa lo que usa POST /tasks.
 * Nos deja probar la ruta sin base de datos y ademas verificar
 * si la ruta llego (o no) a tocar la capa de datos.
 */
function crearPrismaFalso() {
  return {
    task: {
      create: vi.fn(async ({ data }: any) => ({ id: 1, ...data })),
    },
  };
}

describe("POST /tasks", () => {
  it("crea la tarea y responde 201 cuando el texto es valido", async () => {
    const prisma = crearPrismaFalso();
    const app = createApp(prisma);

    const response = await request(app)
      .post("/tasks")
      .send({ text: "Estudiar Node.js" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      text: "Estudiar Node.js",
      completed: false,
    });
    // La tarea nueva siempre nace pendiente, sin importar lo que mande el cliente.
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: { text: "Estudiar Node.js", completed: false },
    });
  });

  it("responde 400 cuando el texto viene vacio", async () => {
    const prisma = crearPrismaFalso();
    const app = createApp(prisma);

    const response = await request(app).post("/tasks").send({ text: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Task text is required" });
    // Con un texto invalido no se debe llegar a la base de datos.
    expect(prisma.task.create).not.toHaveBeenCalled();
  });
});
