import { Link } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";

/**
 * Shell proporciona el layout general de la aplicación: cabecera animada y área principal.
 * Incluye enlaces de navegación a Inicio y Perfil.
 */
export default function Shell({ children }) {
  // Animación para la aparición del encabezado
  const header = useSpring({ from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 } });

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
          </nav>
        </div>
      </animated.header>
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1">{children}</main>
      {/* Pie de página con redes sociales y contacto */}
      <footer className="bg-emerald-100 text-emerald-800 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid gap-4 md:flex md:justify-between md:items-center">
          <div>
            <h3 className="font-semibold mb-2">Síguenos</h3>
            <div className="flex gap-6">
              {/* Se utilizan clases de Font Awesome; requieren importar los estilos en src/styles/index.css */}
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