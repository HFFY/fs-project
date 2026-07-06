import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setError("");
    try {
      // 1. Send credentials to /login. Only valid users get a token back.
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

      // 2. Immediately call /profile using the token we just received.
      const profileResponse = await fetch("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Only if /profile answers correctly do we go to /home.
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
