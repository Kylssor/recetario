import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import CalorieHistoryChart from "../components/CalorieHistoryChart";

/**
 * Componente que muestra el perfil del usuario autenticado, permite la edición
 * de sus datos y visualiza su historial de consumo calórico.
 */
export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Estados para el gráfico de historial
  const [historyData, setHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  // Animación de entrada para el contenedor del perfil.
  const profileAnimation = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  // Carga inicial del usuario desde sessionStorage.
  useEffect(() => {
    const stored = sessionStorage.getItem("currentUser");
    if (stored) {
      try {
        const currentUser = JSON.parse(stored);
        setUser(currentUser);
        setFormData(currentUser); // Inicializa el formulario con los datos del usuario.
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Carga del historial calórico cuando el usuario está disponible.
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        setHistoryError(null);
        try {
          const response = await axios.get(
            `http://localhost:3001/api/users/me/calorie-history`,
            { headers: { 'X-User-ID': user.id } }
          );
          setHistoryData(response.data);
        } catch (error) {
          console.error("Error fetching history:", error);
          setHistoryError("No se pudo cargar el historial.");
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    nav("/");
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user); // Restaura el formulario a los datos originales.
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await axios.put(
        `http://localhost:3001/api/users/me`,
        formData,
        { headers: { 'X-User-ID': user.id } }
      );
      const updatedUser = response.data;
      setUser(updatedUser);
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      setSaveError(error.response?.data?.message || "No se pudo guardar el perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-slate-700 mb-4">No hay sesión activa.</p>
          <Link to="/" className="text-emerald-700 hover:underline">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-emerald-50 py-8 px-4 space-y-6">
      <animated.div
        style={profileAnimation}
        className="w-full max-w-lg bg-white rounded-2xl shadow p-6 space-y-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-800">Mi perfil</h1>
            <p className="text-slate-700">
              Aquí puedes ver y editar la información de tu cuenta.
            </p>
          </div>
          {!isEditing && (
            <button onClick={handleEditToggle} className="text-emerald-700 hover:underline text-sm font-medium">
              Editar
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-emerald-700">{user.name}</h2>
            <p className="text-slate-700">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing ? (
            // --- MODO EDICIÓN ---
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="font-medium text-emerald-700 text-sm">Nombre</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="font-medium text-emerald-700 text-sm">Meta calórica diaria (kcal)</label>
                <input type="number" name="calorieGoal" value={formData.calorieGoal || ''} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="font-medium text-emerald-700 text-sm">Número de teléfono</label>
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="font-medium text-emerald-700 text-sm">Dirección</label>
                <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="font-medium text-emerald-700 text-sm">Identificación</label>
                <input type="text" name="idNumber" value={formData.idNumber || ''} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1" />
              </div>
            </div>
          ) : (
            // --- MODO VISTA ---
            <div className="grid grid-cols-1 gap-4">
              <div>
                <span className="font-medium text-emerald-700">Meta calórica diaria:</span>
                <span className="ml-2 text-slate-700">{user.calorieGoal} kcal</span>
              </div>
              <div>
                <span className="font-medium text-emerald-700">Número de teléfono:</span>
                <span className="ml-2 text-slate-700">{user.phone}</span>
              </div>
              <div>
                <span className="font-medium text-emerald-700">Dirección:</span>
                <span className="ml-2 text-slate-700">{user.address}</span>
              </div>
              <div>
                <span className="font-medium text-emerald-700">Identificación:</span>
                <span className="ml-2 text-slate-700">{user.idNumber}</span>
              </div>
            </div>
          )}

          {saveError && <p className="text-sm text-red-600 text-center">{saveError}</p>}

          {isEditing && (
            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" disabled={isSaving} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 disabled:bg-slate-400">
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button type="button" onClick={handleCancel} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg py-2">
                Cancelar
              </button>
            </div>
          )}
        </form>

        {/* Historial de Calorías */}
        {!isEditing && (
          <div className="pt-4 border-t">
            {isLoadingHistory ? (
              <p className="text-center text-slate-500">Cargando historial...</p>
            ) : historyError ? (
              <p className="text-center text-red-500">{historyError}</p>
            ) : historyData.length > 0 ? (
              <div className="h-64">
                <CalorieHistoryChart
                  historyData={historyData}
                  calorieGoal={user.calorieGoal}
                />
              </div>
            ) : (
              <p className="text-center text-slate-500">
                No hay datos en el historial para mostrar.
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t flex justify-between items-center">
          <Link to="/home" state={{ reset: true }} className="text-emerald-700 hover:underline">
            Ir a inicio
          </Link>
          <button onClick={handleLogout} className="text-red-600 hover:underline text-sm">
            Cerrar sesión
          </button>
        </div>
      </animated.div>
    </div>
  );
}