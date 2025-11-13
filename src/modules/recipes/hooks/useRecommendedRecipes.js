import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { getImageUrl } from '../../../utils/image'

/**
 * Hook personalizado para obtener una lista de recetas recomendadas.
 *
 * @param {object} options - Opciones para el hook.
 * @param {number} [options.count=3] - El número de recetas a obtener.
 * @returns {{recommendedRecipes: Array, loading: boolean, error: string | null}}
 */
export function useRecommendedRecipes({ count = 3 } = {}) {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/users/me/recommended-recipes?count=${count}`);
        const recipes = response.data.map(recipe => ({
          ...recipe,
          image: getImageUrl(recipe.image, recipe.title),
        }));
        setRecommendedRecipes(recipes);
      } catch (err) {
        console.error("Error al obtener recetas recomendadas:", err);
        setError('No se pudieron cargar las recomendaciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [count]); // Vuelve a ejecutar si cambia el número de recetas solicitadas.

  return { recommendedRecipes, loading, error };
}