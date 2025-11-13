import { useAuthStore } from '../../auth/stores/auth.js';
import { usePlannerStore } from '../stores/planner.js';
import DailyCalorieChart from './DailyCalorieChart';
import { Button } from '../../../components/Button.jsx';

/**
 * Componente que muestra el planificador diario.
 * Incluye un gráfico de calorías y una lista de las recetas seleccionadas.
 */
export default function DailyPlanner() {
  // Se suscribe al store de Zustand para obtener el estado del planificador.
  const planEntries = usePlannerStore((state) => state.planEntries);
  const removeRecipe = usePlannerStore((state) => state.removeRecipe);
  const isLoading = usePlannerStore((state) => state.isLoading);
  const error = usePlannerStore((state) => state.error);

  const currentUser = useAuthStore((state) => state.profile);

  // Calcula el total de calorías de las recetas en el plan.
  const totalCalories = planEntries.reduce((sum, entry) => sum + entry.recipe.kcal, 0);
  const calorieGoal = currentUser?.calorieGoal || 2000; // Usa 2000 como meta por defecto si no hay usuario.

  // Agrupa las recetas para mostrar un contador en lugar de duplicados.
  const groupedRecipes = planEntries.reduce((acc, entry) => {
    const recipeId = entry.recipe.id;
    if (!acc[recipeId]) {
      // Si es la primera vez que vemos esta receta, la inicializamos en el acumulador.
      acc[recipeId] = {
        ...entry.recipe,
        count: 0,
        planEntryIds: [], // Guardamos los IDs de cada instancia para poder borrarlos uno por uno.
      };
    }
    acc[recipeId].count += 1;
    acc[recipeId].planEntryIds.push(entry.id);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-emerald-800 mb-2">Planificador Diario</h2>
        <p className="text-slate-600">Cargando tu plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (planEntries.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-emerald-800 mb-2">Planificador Diario</h2>
        <p className="text-slate-600">
          Añade recetas a tu plan diario para ver aquí tu progreso calórico.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Sección del gráfico */}
      <div className="relative h-48 w-full self-center">
        <DailyCalorieChart planEntries={planEntries} calorieGoal={calorieGoal} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-emerald-800">{totalCalories}</span>
          <span className="text-sm text-slate-500">de {calorieGoal} kcal</span>
        </div>
      </div>

      {/* Sección de la lista de recetas */}
      <div>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">Recetas en tu Plan</h2>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {Object.values(groupedRecipes).map((groupedRecipe) => (
            <li
              key={groupedRecipe.id}
              className="flex justify-between items-center bg-emerald-50 p-2 rounded-lg"
            >
              <span className="text-slate-700 flex items-center">
                {groupedRecipe.title}
                {groupedRecipe.count > 1 && (
                  <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    x {groupedRecipe.count}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-emerald-700">{groupedRecipe.kcal} kcal</span>
                <Button
                  variant="icon"
                  size="icon"
                  onClick={() => removeRecipe(groupedRecipe.planEntryIds[0])}
                  title="Eliminar del plan"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
