import { Link, useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";

/**
 * Componente de layout principal (Shell) que envuelve las vistas de la aplicación.
 * Define la estructura general con un encabezado, área de contenido principal y pie de página.
 */
export default function Shell({ children }) {
  const nav = useNavigate();
  // Define la animación de entrada para el encabezado.
  const header = useSpring({ from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 } });

  /**
   * Cierra la sesión del usuario eliminando sus datos de sessionStorage
   * y redirigiendo a la página de inicio.
   */
  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    nav("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 text-slate-800">
      <animated.header
        style={header}
        className="sticky top-0 bg-emerald-50/80 backdrop-blur z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-semibold text-emerald-800">Recetario Verde</div>
          <nav className="text-sm flex items-center gap-4">
            <Link
              className="text-emerald-700 hover:underline"
              to="/home"
              state={{ reset: true }}
            >
              Inicio
            </Link>
            <Link className="text-emerald-700 hover:underline" to="/profile">
              Perfil
            </Link>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </animated.header>
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1">{children}</main>
      {/* Pie de página con información de contacto y redes sociales. */}
      <footer className="bg-emerald-100 text-emerald-800 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid gap-4 md:flex md:justify-between md:items-center">
          <div>
            <h3 className="font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-6">
              {/* Los iconos de redes sociales requieren la importación de Font Awesome. */}
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-whatsapp fa-lg"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contáctanos</h3>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-phone fa-sm"></i>
              <span className="text-sm">+57 300 123 4567</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <i className="fa-brands fa-whatsapp fa-sm"></i>
              <span className="text-sm">+57 312 345 6789</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}