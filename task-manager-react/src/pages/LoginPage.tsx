import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setError("");
    try {
      const loginResponse = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (!loginResponse.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const { token } = await loginResponse.json();

      const profileResponse = await fetch("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        setError("No se pudo validar la sesión");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/home");
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <Login
      onSubmit={handleLogin}
      error={error}
      footer={<Link to="/register">¿No tienes cuenta? Regístrate</Link>}
    />
  );
}

export default LoginPage;
