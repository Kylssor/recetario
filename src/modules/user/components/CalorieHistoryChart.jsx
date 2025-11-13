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
import useLocale from '../../../utils/useLocale.js';

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
 * Componente que renderiza un gráfico de barras apilado mostrando el historial
 * de consumo de calorías, con el excedente coloreado en rojo.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {Array<{date: string, totalCalories: number}>} props.historyData - Los datos del historial.
 * @param {number} props.calorieGoal - La meta calórica diaria del usuario.
 */
export default function CalorieHistoryChart({ historyData = [], calorieGoal = 2000 }) {
  const locale = useLocale();
  // Formatea las etiquetas de fecha de forma amigable (ej: Oct 26).
  const labels = historyData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    });
  });

  // Se preparan los datos para los dos datasets que se apilarán.
  const baseData = historyData.map(item => Math.min(item.totalCalories, calorieGoal));
  const excessData = historyData.map(item => Math.max(0, item.totalCalories - calorieGoal));

  const data = {
    labels,
    datasets: [
      {
        label: 'Calorías dentro de la meta',
        data: baseData,
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 4,
      },
      {
        label: 'Excedente calórico',
        data: excessData,
        backgroundColor: '#ef4444', // red-500
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
        display: false,
      },

      tooltip: {
        callbacks: {
          // Muestra la etiqueta para el segmento específico (ej: "Excedente: 200 kcal").
          label: function (context) {
            if (!context.raw || context.raw === 0) {
              return null;
            }
            return `${context.dataset.label}: ${context.raw} kcal`;
          },
          // Suma los valores de todos los segmentos en la barra para mostrar un total.
          footer: function (tooltipItems) {
            let sum = 0;
            tooltipItems.forEach(function (tooltipItem) {
              sum += tooltipItem.parsed.y;
            });
            return `Total: ${sum} kcal`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Esencial para apilar las barras horizontalmente.
      },
      y: {
        stacked: true, // Esencial para apilar las barras verticalmente.
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