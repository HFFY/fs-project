import { useState } from "react";

type LoginProps = {
  onSubmit: (username: string, password: string) => void;
  title?: string;
  buttonLabel?: string;
  error?: string;
  footer?: React.ReactNode;
};

function Login(props: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") return;
    props.onSubmit(username, password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>{props.title ?? "Log In"}</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button type="submit">{props.buttonLabel ?? "Login"}</button>
        {props.error && <p className="login-error">{props.error}</p>}
        {props.footer && <div className="login-footer">{props.footer}</div>}
      </form>
    </div>
  );
}

export default Login;
