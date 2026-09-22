import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../pages/HomePage";

function mockApi(profileUser: Record<string, unknown> | null) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url.endsWith("/tasks")) {
      return { ok: true, status: 200, json: async () => [] } as Response;
    }
    if (url.endsWith("/profile")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ user: profileUser }),
      } as Response;
    }
    throw new Error(`URL inesperada: ${url}`);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("HomePage - saludo de bienvenida", () => {
  it("saluda por su nombre cuando el usuario lo registro", async () => {
    localStorage.setItem("token", "token-de-prueba");
    mockApi({ email: "hugo", firstName: "Hugo", lastName: "Flores" });

    render(<HomePage />);

    expect(
      await screen.findByRole("heading", { name: "Bienvenido Hugo" })
    ).toBeInTheDocument();
  });

  it("muestra solo 'Bienvenido' para un usuario antiguo sin nombre", async () => {
    localStorage.setItem("token", "token-de-prueba");
    const fetchMock = mockApi({ email: "viejo", firstName: null, lastName: null });

    render(<HomePage />);

    expect(await screen.findByRole("heading", { name: "Bienvenido" })).toBeInTheDocument();
    // Esperar a que la peticion de perfil haya ocurrido y el titulo siga igual.
    await vi.waitFor(() =>
      expect(fetchMock.mock.calls.some(([u]) => String(u).endsWith("/profile"))).toBe(true)
    );
    expect(screen.getByRole("heading", { name: "Bienvenido" })).toBeInTheDocument();
  });

  it("muestra solo 'Bienvenido' cuando no hay token guardado", async () => {
    const fetchMock = mockApi(null);

    render(<HomePage />);

    expect(await screen.findByRole("heading", { name: "Bienvenido" })).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([u]) => String(u).endsWith("/profile"))).toBe(false);
  });
});
