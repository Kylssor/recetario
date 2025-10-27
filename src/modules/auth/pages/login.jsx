import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

/**
 * Página de inicio de sesión. Permite al usuario introducir correo y contraseña.
 * Incluye enlace a la página de registro si el usuario aún no tiene cuenta.
 */
export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  /**
   * Maneja el envío del formulario. Valida que se hayan
   * ingresado correo y contraseña antes de permitir el acceso.
   * Si hay errores, los muestra; de lo contrario, navega a Home.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = "Ingresa tu correo";
    if (!password.trim()) errs.password = "Ingresa tu contraseña";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Autenticación local: buscar usuario en localStorage
      const usersStr = localStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const found = users.find(
        (u) => u.email === email.trim() && u.password === password.trim(),
      );
      if (!found) {
        setErrors({ credentials: "Correo o contraseña incorrectos" });
        return;
      }
      // Guardar usuario en sesión y navegar al home
      sessionStorage.setItem("currentUser", JSON.stringify(found));
      nav("/home", { state: { reset: true } });
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
        {errors.credentials && <p className="text-red-500 text-sm">{errors.credentials}</p>}
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


