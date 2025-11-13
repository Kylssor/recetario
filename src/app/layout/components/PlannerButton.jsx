import { useAuthStore } from '../../../modules/auth/stores/auth.js';
import { usePlannerStore } from '../../../modules/recipes/stores/planner.js';
import DailyCalorieChart from '../../../modules/recipes/components/DailyCalorieChart.jsx';
import HeaderButton from './HeaderButton.jsx';

/**
 * A specialized button for the header that displays a mini calorie chart
 * and the user's current calorie consumption, acting as the trigger for the planner dropdown.
 */
export default function PlannerButton({ onClick }) {
  const planEntries = usePlannerStore((state) => state.planEntries);
  const currentUser = useAuthStore((state) => state.profile);

  // Safely calculate total calories, defaulting to 0 if recipe is missing.
  const totalCalories = planEntries.reduce((sum, entry) => sum + (entry.recipe?.kcal || 0), 0);
  const calorieGoal = currentUser?.calorieGoal || 2000;

  return (
    <HeaderButton onClick={onClick} className="pl-2 pr-4">
      <div className="relative h-9 w-9">
        <DailyCalorieChart
          planEntries={planEntries}
          calorieGoal={calorieGoal}
          interactive={false}
        />
      </div>
      <span className="font-semibold">Mi Plan</span>
    </HeaderButton>
  );
}