// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

const jwt = require("jsonwebtoken");

const JWT_SECRET = "secreto-de-prueba";

/**
 * Prisma falso para usuarios: guarda en memoria lo que se crea, para
 * comprobar que nombre y apellidos llegan a la capa de datos.
 */
function crearPrismaFalso(usuariosIniciales: any[] = []) {
  const usuarios = [...usuariosIniciales];
  return {
    user: {
      findUnique: vi.fn(async ({ where }: any) =>
        usuarios.find((u) => u.username === where.username) ?? null
      ),
      create: vi.fn(async ({ data }: any) => {
        usuarios.push(data);
        return data;
      }),
    },
  };
}

describe("POST /users", () => {
  it("guarda nombre y apellidos junto con el usuario", async () => {
    const prisma = crearPrismaFalso();
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });

    const response = await request(app).post("/users").send({
      username: "hugo",
      password: "secreta123",
      firstName: "  Hugo ",
      lastName: "Flores",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      username: "hugo",
      firstName: "Hugo",
      lastName: "Flores",
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        username: "hugo",
        firstName: "Hugo",
        lastName: "Flores",
      }),
    });
    // La contrasena nunca se guarda ni se devuelve en texto plano.
    const datosGuardados = prisma.user.create.mock.calls[0][0].data;
    expect(datosGuardados.password).not.toBe("secreta123");
    expect(response.body.password).toBeUndefined();
  });

  it("responde 400 y no crea nada cuando falta el nombre o los apellidos", async () => {
    const prisma = crearPrismaFalso();
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });

    const sinApellidos = await request(app)
      .post("/users")
      .send({ username: "ana", password: "secreta123", firstName: "Ana" });
    expect(sinApellidos.status).toBe(400);

    const nombreEnBlanco = await request(app)
      .post("/users")
      .send({ username: "ana", password: "secreta123", firstName: "   ", lastName: "Perez" });
    expect(nombreEnBlanco.status).toBe(400);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

describe("GET /profile", () => {
  it("devuelve el nombre guardado del usuario", async () => {
    const prisma = crearPrismaFalso([
      { username: "hugo", password: "hash", firstName: "Hugo", lastName: "Flores" },
    ]);
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });
    const token = jwt.sign({ email: "hugo" }, JWT_SECRET);

    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      email: "hugo",
      firstName: "Hugo",
      lastName: "Flores",
    });
  });

  it("devuelve null en el nombre para un usuario antiguo sin nombre", async () => {
    // Usuario creado antes de existir las columnas: no tiene firstName/lastName.
    const prisma = crearPrismaFalso([{ username: "viejo", password: "hash" }]);
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });
    const token = jwt.sign({ email: "viejo" }, JWT_SECRET);

    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.firstName).toBeNull();
    expect(response.body.user.lastName).toBeNull();
  });
});
