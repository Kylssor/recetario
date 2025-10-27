import { Link } from "react-router-dom";

// Página de perfil básica. Sustituye datos estáticos por datos reales según tu backend.
export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-emerald-50 py-8 px-4 space-y-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-emerald-800">Mi perfil</h1>
        <p className="text-slate-700">
          Aquí puedes ver y editar la información de tu cuenta.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="font-medium text-emerald-700">Nombre:</span>
            <span className="ml-2 text-slate-700">Usuario de ejemplo</span>
          </div>
          <div>
            <span className="font-medium text-emerald-700">Correo:</span>
            <span className="ml-2 text-slate-700">usuario@ejemplo.com</span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <Link
            to="/home"
            className="text-emerald-700 hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}