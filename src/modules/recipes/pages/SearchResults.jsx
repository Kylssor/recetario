import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';
import { useRecipeStore } from '../stores/recipe.js';
import RecipeCard from '../components/RecipeCard.jsx';

/**
 * Página que muestra los resultados de una búsqueda de recetas.
 * Obtiene el término de búsqueda de los parámetros de la URL.
 */
export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  // Accede al estado y las acciones del store de recetas.
  const recipes = useRecipeStore((state) => state.recipes);
  const isLoading = useRecipeStore((state) => state.isLoading);
  const searchRecipes = useRecipeStore((state) => state.searchRecipes);
  const clearSearch = useRecipeStore((state) => state.clearSearch);

  // Ejecuta la búsqueda cuando el componente se monta o el 'query' en la URL cambia.
  useEffect(() => {
    if (query) {
      searchRecipes(query);
    }

    // La función de limpieza se ejecuta cuando el usuario navega fuera de esta página.
    // Este es el lugar correcto para limpiar los resultados de búsqueda.
    return () => {
      clearSearch();
    };
  }, [query, searchRecipes, clearSearch]);

  // Define la animación para la entrada de los resultados.
  const transitions = useTransition(recipes, {
    from: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0 },
    key: (item) => item.id,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-emerald-800">
        Resultados para: <span className="font-bold">"{query}"</span>
      </h1>

      {isLoading && (
        <p className="text-center text-slate-600">Buscando recetas...</p>
      )}

      {!isLoading && recipes.length === 0 && (
        <p className="text-center text-slate-600">
          No se encontraron recetas. Intenta con otro ingrediente.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {transitions((style, item) => (
          <animated.div style={style} key={item.id}>
            <RecipeCard recipe={item} />
          </animated.div>
        ))}
      </div>
    </div>
  );
}