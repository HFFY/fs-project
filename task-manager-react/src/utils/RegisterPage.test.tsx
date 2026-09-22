import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RegisterPage", () => {
  it("envia nombre y apellidos junto con usuario y contrasena", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ ok: true, status: 201, json: async () => ({}) } as Response);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Nombre"), "Hugo");
    await user.type(screen.getByPlaceholderText("Apellidos"), "Flores");
    await user.type(screen.getByPlaceholderText("Usuario"), "hugo");
    await user.type(screen.getByPlaceholderText("Contraseña"), "secreta123");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users");
    expect(JSON.parse(options!.body as string)).toEqual({
      username: "hugo",
      password: "secreta123",
      firstName: "Hugo",
      lastName: "Flores",
    });
  });

  it("no llama al backend y muestra error si falta el nombre o los apellidos", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch");

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Nombre"), "Hugo");
    await user.type(screen.getByPlaceholderText("Usuario"), "hugo");
    await user.type(screen.getByPlaceholderText("Contraseña"), "secreta123");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Nombre y apellidos son obligatorios")).toBeInTheDocument();
  });
});
