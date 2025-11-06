import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

/**
 * Componente que renderiza la página de inicio de sesión.
 * Permite al usuario autenticarse con su correo y contraseña.
 */
export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Almacena los errores de validación del formulario.
  const [errors, setErrors] = useState({});

  /**
   * Procesa el envío del formulario de inicio de sesión.
   * Valida los campos y, si son correctos, envía una solicitud
   * de autenticación al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = "Ingresa tu correo";
    if (!password.trim()) errs.password = "Ingresa tu contraseña";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const response = await axios.post("http://localhost:3001/api/login", {
          email: email.trim(),
          password: password.trim(),
        });
        
        const user = response.data;
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        nav("/home", { state: { reset: true } });
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrors({ api: error.response.data.message });
        } else {
          setErrors({
            api: "Ocurrió un error al iniciar sesión. Inténtalo de nuevo.",
          });
        }
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50">
      <form
        className="bg-white rounded-2xl shadow p-6 grid gap-3 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-semibold text-emerald-800">Iniciar sesión</h1>
        <input
          className="border rounded-xl p-3"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <input
          className="border rounded-xl p-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        {errors.api && <p className="text-red-500 text-sm text-center">{errors.api}</p>}
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2"
        >
          Entrar
        </button>
        <p className="text-sm">
          ¿No tienes cuenta? {" "}
          <Link className="underline" to="/register">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}