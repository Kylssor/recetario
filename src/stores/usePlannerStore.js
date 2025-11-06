import { create } from 'zustand';
import axios from 'axios';

/**
 * Helper para obtener el ID del usuario actual desde sessionStorage
 * y preparar las cabeceras de autenticación para las llamadas a la API.
 * @returns {object|null} Un objeto con la cabecera X-User-ID o null si no hay usuario.
 */
const getAuthHeaders = () => {
  try {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return { 'X-User-ID': user.id };
  } catch (error) {
    console.error("Error al parsear datos de sesión:", error);
    return null;
  }
};

/**
 * Store de Zustand para gestionar el estado del planificador diario.
 * Este store se sincroniza con el backend para persistir los datos.
 */
const usePlannerStore = create((set, get) => ({
  // --- ESTADO ---
  planId: null,      // El ID del DailyPlan de hoy.
  planEntries: [],   // La lista de PlanEntry (recetas añadidas).
  isLoading: true,   // True mientras se cargan los datos iniciales.
  error: null,       // Almacena mensajes de error de la API.

  // --- ACCIONES ---

  /**
   * Carga el planificador del día actual desde el backend.
   * Si no existe un plan para hoy, la API crea uno nuevo.
   */
  fetchPlanner: async () => {
    const headers = getAuthHeaders();
    if (!headers) {
      set({ isLoading: false, error: "Usuario no autenticado." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("http://localhost:3001/api/planner/today", { headers });
      const plan = response.data;
      set({
        planId: plan.id,
        planEntries: plan.entries || [], // La API devuelve las entradas con las recetas anidadas.
        isLoading: false,
      });
    } catch (err) {
      console.error("Error al cargar el planificador:", err);
      set({ isLoading: false, error: "No se pudo cargar el planificador." });
    }
  },

  /**
   * Añade una receta al plan diario actual haciendo una llamada a la API.
   * @param {object} recipe - El objeto completo de la receta a añadir.
   */
  addRecipe: async (recipe) => {
    const headers = getAuthHeaders();
    const { planId } = get();
    if (!headers || !planId) {
      console.error("No se puede añadir la receta: falta el usuario o el ID del plan.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/planner/entries",
        { recipeId: recipe.id, planId },
        { headers }
      );
      const newEntry = response.data;
      // Actualiza el estado local con la nueva entrada devuelta por el backend.
      set((state) => ({
        planEntries: [...state.planEntries, newEntry],
      }));
    } catch (err) {
      console.error("Error al añadir la receta:", err);
      // Opcional: se podría setear un estado de error para la UI.
    }
  },

  /**
   * Elimina una entrada específica del plan diario.
   * @param {number} planEntryId - El ID único de la entrada del plan (no el de la receta).
   */
  removeRecipe: async (planEntryId) => {
    const headers = getAuthHeaders();
    if (!headers) {
      console.error("No se puede eliminar la receta: usuario no autenticado.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/planner/entries/${planEntryId}`, { headers });
      // Si la llamada tiene éxito, actualiza el estado local filtrando la entrada eliminada.
      set((state) => ({
        planEntries: state.planEntries.filter((entry) => entry.id !== planEntryId),
      }));
    } catch (err) {
      console.error("Error al eliminar la receta:", err);
    }
  },
}));

export default usePlannerStore;