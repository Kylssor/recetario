import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Es necesario registrar los componentes de Chart.js que se van a utilizar.
ChartJS.register(ArcElement, Tooltip, Legend);

// Helper to generate a vibrant, distinct color palette using the golden angle.
const generateColorPalette = (count) => {
  const colors = [];
  const hueStart = 40; // Start with a nice green-ish color
  const goldenAngle = 137.5;
  
  for (let i = 0; i < count; i++) {
    const hue = (hueStart + i * goldenAngle) % 360;
    colors.push(`hsl(${hue}, 65%, 55%)`);
  }
  return colors;
};

/**
 * Componente que renderiza un gráfico de dona para visualizar el consumo calórico.
 * Muestra cada receta como un segmento del gráfico.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {Array} [props.planEntries=[]] - Array de las entradas del planificador diario.
 * @param {number} [props.calorieGoal=2000] - La meta calórica diaria del usuario.
 * @param {boolean} [props.interactive=true] - Si el gráfico debe tener tooltips y hover.
 */
export default function DailyCalorieChart({ planEntries = [], calorieGoal = 2000, interactive = true }) {
  const totalCalories = planEntries.reduce((sum, entry) => sum + (entry.recipe?.kcal || 0), 0);

  const chartLabels = planEntries.map(entry => entry.recipe?.title || 'Desconocido');
  const dataValues = planEntries.map(entry => entry.recipe?.kcal || 0);
  const backgroundColors = generateColorPalette(planEntries.length);

  const remainingCalories = calorieGoal - totalCalories;
  // Solo mostrar "Restantes" si no hemos superado la meta.
  if (remainingCalories > 0) {
    chartLabels.push('Restantes');
    dataValues.push(remainingCalories);
    backgroundColors.push('#e5e7eb'); // gray-200
  }

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Calorías',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: interactive,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} kcal`;
          },
        },
      },
    },
    events: interactive ? ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'] : [],
  };

  return <Doughnut data={data} options={options} />;
}