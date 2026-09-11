import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";

describe("Login", () => {
  it("envia usuario y contrasena cuando el formulario esta lleno", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Login onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Usuario"), "hugo");
    await user.type(screen.getByPlaceholderText("Contraseña"), "secreta123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("hugo", "secreta123");
  });

  it("no envia nada cuando los campos estan vacios", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Login onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
