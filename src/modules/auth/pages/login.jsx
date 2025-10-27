import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50">
      <form className="bg-white rounded-2xl shadow p-6 grid gap-3"
            onSubmit={(e)=>{e.preventDefault(); nav("/home");}}>
        <h1 className="text-xl font-semibold text-emerald-800">Bienvenido</h1>
        <input className="border rounded-xl p-3" placeholder="Correo" />
        <input className="border rounded-xl p-3" type="password" placeholder="Contraseña" />
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2">Entrar</button>
        <Link to="/register" className="underline text-sm">Regístrate</Link>
      </form>
    </div>
  );
}

