import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

/**
 * Página de registro. Incluye una validación básica de nombre, correo y contraseña.
 * En un proyecto real, se debería enviar la información al backend y gestionar tokens.
 */
export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para la meta calórica del usuario
  const [calorieGoal, setCalorieGoal] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (name.trim().length < 2) errs.name = "Debe tener al menos 2 caracteres";
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Correo inválido";
    if (password.trim().length < 6) errs.password = "Mínimo 6 caracteres";
    // Validación básica para la meta calórica: debe ser un número positivo
    if (!calorieGoal || isNaN(calorieGoal) || Number(calorieGoal) <= 0) {
      errs.calorieGoal = "Ingresa una meta calórica válida (número positivo)";
    }
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Registrar usuario en localStorage
      const usersStr = localStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      // Verificar si el correo ya está registrado
      const exists = users.some((u) => u.email === email.trim());
      if (exists) {
        setErrors({ email: "Ya existe una cuenta con este correo" });
        return;
      }
      // Generar avatar aleatorio usando pravatar
      const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(email.trim())}`;
      const newUser = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        calorieGoal: Number(calorieGoal),
        avatar: avatarUrl,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      // Guardar usuario en sessionStorage para sesión actual
      sessionStorage.setItem("currentUser", JSON.stringify(newUser));
      nav("/home", { state: { reset: true } });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50">
      <form
        className="bg-white rounded-2xl shadow p-6 grid gap-3 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-semibold text-emerald-800">Crear cuenta</h1>
        <input
          className="border rounded-xl p-3"
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
        <input
          className="border rounded-xl p-3"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
        <input
          className="border rounded-xl p-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
        {/* Campo para meta calórica */}
        <input
          className="border rounded-xl p-3"
          type="number"
          placeholder="Meta calórica diaria (kcal)"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(e.target.value)}
        />
        {errors.calorieGoal && (
          <p className="text-red-500 text-sm">{errors.calorieGoal}</p>
        )}
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2">
          Registrarme
        </button>
        <p className="text-sm">
          ¿Ya tienes cuenta? {" "}
          <Link className="underline" to="/">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}