import { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import RecipeCard from "../components/RecipeCard.jsx";

import { useRecommendedRecipes } from "../hooks/useRecommendedRecipes.js";

/**
 * Componente principal que muestra el contenido de la página de inicio.
 * Muestra una vista introductoria o los resultados de una búsqueda,
 * consumiendo el estado de búsqueda del `useRecipeStore`.
 */
export default function Home() {
  const { recommendedRecipes, loading, error } = useRecommendedRecipes({
    count: 6,
  });

  // Animación para la sección de introducción.
  const intro = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  return (
    <div className="space-y-8">
      {/* Sección de Recetas Recomendadas */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold text-emerald-800 text-center">
          Recetas Recomendadas
        </h2>
        {loading && <p className="text-center">Cargando...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {recommendedRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRecipes.map((recipe) => (
              <animated.div style={intro} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </animated.div>
            ))}
          </div>
        )}
        {!loading && recommendedRecipes.length === 0 && !error && (
          <p className="text-center">No hay recetas para recomendar.</p>
        )}
      </div>
    </div>
  );
}
