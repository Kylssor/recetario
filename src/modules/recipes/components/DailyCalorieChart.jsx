import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Es necesario registrar los componentes de Chart.js que se van a utilizar
// para que el árbol de dependencias funcione correctamente.
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente que renderiza un gráfico de dona para visualizar el consumo calórico
 * en comparación con una meta diaria.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {number} props.consumedCalories - El total de calorías consumidas.
 * @param {number} props.calorieGoal - La meta calórica diaria del usuario.
 */
export default function DailyCalorieChart({ consumedCalories, calorieGoal }) {
  // Se calculan las calorías restantes, asegurando que no sea un número negativo
  // para la visualización en el gráfico.
  const remainingCalories = Math.max(0, calorieGoal - consumedCalories);
  const isOverGoal = consumedCalories > calorieGoal;

  const data = {
    labels: ['Consumidas', 'Restantes'],
    datasets: [
      {
        label: 'Calorías',
        data: [consumedCalories, remainingCalories],
        backgroundColor: [
          // Cambia a color rojo si se supera la meta calórica.
          isOverGoal ? '#dc2626' : '#059669', // red-600 vs emerald-600
          '#e5e7eb', // gray-200
        ],
        borderColor: [
          '#ffffff', // Borde blanco para separación visual
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Controla el grosor del anillo del gráfico.
    plugins: {
      legend: {
        display: false, // Se oculta la leyenda para un diseño más limpio.
      },
      tooltip: {
        // Personaliza el texto que aparece al pasar el cursor sobre el gráfico.
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} kcal`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}