// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * En el pipeline JWT_SECRET llega desde GitHub Secrets; en local, si no esta
 * definido, se usa un valor de prueba. Nunca se imprime.
 */
const JWT_SECRET = process.env.JWT_SECRET || "secreto-de-prueba-local";

async function crearPrismaConUsuario(username: string, password: string) {
  const hash = await bcrypt.hash(password, 4);
  return {
    user: {
      findUnique: vi.fn(async ({ where }: any) =>
        where.username === username ? { username, password: hash } : null
      ),
    },
  };
}

describe("autenticacion con JWT", () => {
  it("el token de /login esta firmado con el secreto configurado y abre /profile", async () => {
    const prisma = await crearPrismaConUsuario("ana", "claveDePrueba123");
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });

    const login = await request(app)
      .post("/login")
      .send({ email: "ana", password: "claveDePrueba123" });

    expect(login.status).toBe(200);
    // Se verifica con el secreto del entorno, no con un valor fijo del codigo.
    expect(jwt.verify(login.body.token, JWT_SECRET).email).toBe("ana");

    const profile = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(profile.status).toBe(200);
    expect(profile.body.user.email).toBe("ana");
  });

  it("rechaza con 401 un token firmado con otro secreto", async () => {
    const prisma = await crearPrismaConUsuario("ana", "claveDePrueba123");
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });

    const tokenFalsificado = jwt.sign({ email: "ana" }, "secret_key");

    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${tokenFalsificado}`);

    expect(response.status).toBe(401);
  });

  it("responde 401 con una contrasena incorrecta", async () => {
    const prisma = await crearPrismaConUsuario("ana", "claveDePrueba123");
    const app = createApp(prisma, { jwtSecret: JWT_SECRET });

    const response = await request(app)
      .post("/login")
      .send({ email: "ana", password: "otraClave" });

    expect(response.status).toBe(401);
  });
});
