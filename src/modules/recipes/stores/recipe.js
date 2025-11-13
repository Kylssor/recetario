import { create } from 'zustand';
import api from '../../../utils/api';
import { getImageUrl } from '../../../utils/image';

/**
 * Store de Zustand para gestionar el estado de las recetas,
 * incluyendo los resultados de búsqueda y el estado de carga.
 */
export const useRecipeStore = create((set) => ({
  // --- ESTADO ---
  recipes: [],
  isLoading: false,

  // --- ACCIONES ---

  /**
   * Ejecuta una búsqueda de recetas por ingrediente llamando a la API.
   * @param {string} ingredient - El término de búsqueda.
   */
  searchRecipes: async (ingredient) => {
    const trimmed = ingredient.trim().toLowerCase();
    
    // Inicia el estado de carga y limpia los resultados anteriores inmediatamente.
    set({ isLoading: true, recipes: [] }); 

    if (!trimmed) {
      set({ isLoading: false }); // Si no hay búsqueda, simplemente termina la carga.
      return;
    }

    try {
      const response = await api.get(
        `/recipes/search?ingredient=${encodeURIComponent(trimmed)}`
      );
      
      // Procesa las URLs de las imágenes para cada receta encontrada.
      const recipesWithImageUrls = response.data.map((recipe) => ({
        ...recipe,
        image: getImageUrl(recipe.image, recipe.title),
      }));
      
      set({ recipes: recipesWithImageUrls, isLoading: false });
    } catch (error) {
      console.error("Error al buscar recetas:", error);
      set({ isLoading: false, recipes: [] }); // En caso de error, asegurar que los resultados estén vacíos.
    }
  },

  /**
   * Limpia los resultados de la búsqueda actual y el estado de carga.
   */
  clearSearch: () => set({ recipes: [], isLoading: false }),
}));

