// @vitest-environment node
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

describe("GET /health", () => {
  it("responde 200 con status ok sin tocar la base de datos", async () => {
    // Prisma vacio: si la ruta intentara usar la BD, el test fallaria.
    const app = createApp({}, { jwtSecret: "secreto-de-prueba" });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
