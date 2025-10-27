import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";

/**
 * Barra de búsqueda con autocompletado de ingredientes.
 *
 * Muestra un campo de texto y un desplegable con sugerencias. Al pulsar
 * Enter o el botón "Buscar", llama a `onSelect` con el término
 * seleccionado. Para evitar que las sugerencias se sobrepongan al campo,
 * el contenedor es relativo y el desplegable tiene z-index alto.
 */
const MOCK_INGREDIENTS = [
  "pollo",
  "atún",
  "zanahoria",
  "avena",
  "huevo",
  "espinaca",
  "lentejas",
  "quinoa",
  "tomate",
  "banana",
  "pepino",
];

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);

  const suggestions = MOCK_INGREDIENTS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const dropdown = useTransition(focus && suggestions.length > 0, {
    from: { opacity: 0, y: -6, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: -6, scale: 0.98 },
    config: { tension: 250, friction: 20 },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    onSelect(trimmed);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded-xl p-3"
          placeholder="Busca por ingrediente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4"
        >
          Buscar
        </button>
      </form>
      {dropdown((style, show) =>
        show ? (
          <animated.ul
            style={style}
            className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow z-50"
          >
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  onMouseDown={() => {
                    setQuery(s);
                    onSelect(s);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50"
                >
                  {s}
                </button>
              </li>
            ))}
          </animated.ul>
        ) : null
      )}
    </div>
  );
}
