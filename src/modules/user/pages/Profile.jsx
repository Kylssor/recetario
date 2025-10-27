import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * Vista de perfil del usuario. En esta versión de ejemplo se muestran
 * datos estáticos. En una implementación real se debería obtener la
 * información del usuario a partir del contexto de autenticación o
 * solicitándola al backend.
 */
export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("currentUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Manejar cierre de sesión
  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    nav("/");
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
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-emerald-800">Mi perfil</h1>
        <p className="text-slate-700">
          Aquí puedes ver la información de tu cuenta.
        </p>
        <div className="flex items-center gap-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-emerald-700">
              {user.name}
            </h2>
            <p className="text-slate-700">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="font-medium text-emerald-700">Meta calórica diaria:</span>
            <span className="ml-2 text-slate-700">
              {user.calorieGoal} kcal
            </span>
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
        <div className="pt-4 border-t flex justify-between items-center">
          <Link
            to="/home"
            state={{ reset: true }}
            className="text-emerald-700 hover:underline"
          >
            Ir a inicio
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}