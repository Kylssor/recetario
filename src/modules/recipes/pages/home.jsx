import { useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { useSpring, animated } from "@react-spring/web";

// Datos simulados hasta conectar con tu API de recetas
const MOCK_RECIPES = [
  {
    title: "Ensalada de pollo",
    description: "Fácil y económica",
    kcal: 350,
    time: "20 min",
    level: "Fácil",
    steps: ["Cortar pollo y verduras", "Mezclar todo", "Aliñar y servir"],
  },
  {
    title: "Tortilla de espinacas",
    description: "Ideal para desayunar",
    kcal: 250,
    time: "15 min",
    level: "Fácil",
    steps: ["Batir huevos", "Saltear espinacas", "Cuajar y dar vuelta"],
  },
];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const intro = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  const handleSearch = (ingredient) => {
    // En un caso real: fetch a tu microservicio de recomendaciones.
    // Aquí filtramos recetas simuladas por ingrediente.
    const results = MOCK_RECIPES.filter((r) =>
      r.title.toLowerCase().includes(ingredient.toLowerCase())
    );
    setRecipes(results);
  };

  return (
    <div className="space-y-8">
      <animated.div style={intro} className="space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-800">Encuentra tu receta</h1>
        <p className="text-slate-700">Ingresa un ingrediente para ver opciones saludables y económicas.</p>
      </animated.div>

      <SearchBar onSelect={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length === 0 ? (
          <p className="col-span-full text-slate-600 italic">No hay recetas para mostrar…</p>
        ) : (
          recipes.map((recipe, idx) => <RecipeCard key={idx} recipe={recipe} />)
        )}
      </div>
    </div>
  );
}
