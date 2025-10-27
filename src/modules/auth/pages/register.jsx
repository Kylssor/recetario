import { useNavigate, Link } from "react-router-dom";

export default function Register(){
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50">
      <form className="bg-white rounded-2xl shadow p-6 grid gap-3"
            onSubmit={(e)=>{e.preventDefault(); nav("/home");}}>
        <h1 className="text-xl font-semibold text-emerald-800">Crear cuenta</h1>
        <input className="border rounded-xl p-3" placeholder="Nombre" />
        <input className="border rounded-xl p-3" placeholder="Correo" />
        <input className="border rounded-xl p-3" type="password" placeholder="Contraseña" />
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2">Registrarme</button>
        <Link to="/" className="underline text-sm">¿Ya tienes cuenta? Inicia sesión</Link>
      </form>
    </div>
  );
}
