import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

/**
 * Componente que renderiza la página de registro para nuevos usuarios.
 * Valida los campos del formulario y envía los datos al backend para crear una cuenta.
 */
export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Almacena la meta calórica diaria del usuario.
  const [calorieGoal, setCalorieGoal] = useState("");
  // Almacena campos adicionales del perfil de usuario.
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [errors, setErrors] = useState({});

  /**
   * Procesa el envío del formulario de registro.
   * Valida los campos y, si son correctos, envía una solicitud
   * de registro al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (name.trim().length < 2) errs.name = "Debe tener al menos 2 caracteres";
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Correo inválido";
    if (password.trim().length < 6) errs.password = "Mínimo 6 caracteres";
    // Validación para la meta calórica: debe ser un número positivo.
    if (!calorieGoal || isNaN(calorieGoal) || Number(calorieGoal) <= 0) {
      errs.calorieGoal = "Ingresa una meta calórica válida (número positivo)";
    }
    // Validación del número de teléfono.
    if (!phone.trim()) {
      errs.phone = "Ingresa un número de teléfono";
    }
    // Validación de la dirección.
    if (!address.trim()) {
      errs.address = "Ingresa una dirección";
    }
    // Validación del número de identificación.
    if (!idNumber.trim()) {
      errs.idNumber = "Ingresa un número de identificación";
    }

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const newUserPayload = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          calorieGoal: Number(calorieGoal),
          phone: phone.trim(),
          address: address.trim(),
          idNumber: idNumber.trim(),
        };

        const response = await axios.post(
          "http://localhost:3001/api/register",
          newUserPayload,
        );

        // El backend devuelve el objeto del usuario (sin contraseña) para la sesión.
        const user = response.data;
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        nav("/home", { state: { reset: true } });
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Extrae el mensaje de error específico devuelto por el backend.
          setErrors({ api: error.response.data.message });
        } else {
          // Define un error genérico si la API no proporciona un mensaje.
          setErrors({
            api: "Ocurrió un error al registrar la cuenta. Inténtalo de nuevo.",
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
        {/* Campo para número de teléfono */}
        <input
          className="border rounded-xl p-3"
          type="tel"
          placeholder="Número de teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
        {/* Campo para dirección */}
        <input
          className="border rounded-xl p-3"
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
        {/* Campo para número de identificación */}
        <input
          className="border rounded-xl p-3"
          type="text"
          placeholder="Número de identificación"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
        {errors.idNumber && (
          <p className="text-red-500 text-sm">{errors.idNumber}</p>
        )}
        {errors.api && <p className="text-red-500 text-sm text-center">{errors.api}</p>}
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