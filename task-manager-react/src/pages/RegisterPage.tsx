import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Login from "../components/Login";

function RegisterPage() {
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (username: string, password: string) => {
    setError("");
    if (firstName.trim() === "" || lastName.trim() === "") {
      setError("Nombre y apellidos son obligatorios");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (response.status === 409) {
        setError("El usuario ya existe");
        return;
      }

      if (!response.ok) {
        setError("No se pudo crear el usuario");
        return;
      }

      // If the user was created correctly, we go to the Login screen.
      navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <Login
      title="Registro"
      buttonLabel="Crear cuenta"
      onSubmit={handleRegister}
      error={error}
      extraFields={
        <>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellidos"
          />
        </>
      }
      footer={<Link to="/">¿Ya tienes cuenta? Inicia sesión</Link>}
    />
  );
}

export default RegisterPage;
