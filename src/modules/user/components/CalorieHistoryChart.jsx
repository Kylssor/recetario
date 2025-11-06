import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Se registran los componentes de Chart.js necesarios para un gráfico de barras.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Componente que renderiza un gráfico de barras mostrando el historial de consumo
 * de calorías de los últimos días.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {Array<{date: string, totalCalories: number}>} props.historyData - Los datos del historial.
 * @param {number} props.calorieGoal - La meta calórica diaria del usuario para la línea de referencia.
 */
export default function CalorieHistoryChart({ historyData = [], calorieGoal = 2000 }) {
  const labels = historyData.map(item => {
    // Formatea la fecha para mostrarla de forma más amigable (ej: Oct 26)
    const date = new Date(item.date);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Calorías Consumidas',
        data: historyData.map(item => item.totalCalories),
        backgroundColor: (context) => {
          // Cambia el color de la barra si las calorías consumidas superan la meta.
          const value = context.raw;
          return value > calorieGoal ? '#ef4444' : '#10b981'; // red-500 vs emerald-500
        },
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio,
    plugins: {
      legend: {
        display: false, // Se oculta la leyenda para un diseño más limpio.
      },
      title: {
        display: true,
        text: 'Consumo Calórico (Últimos 7 Días)',
        font: {
          size: 16,
        },
        color: '#064e3b', // emerald-800
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Consumidas: ${context.raw} kcal`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calorías (kcal)',
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
}