import { useSpring, animated } from '@react-spring/web';

const faqData = [
  {
    question: "¿Cómo funciona la recomendación de recetas?",
    answer: "Nuestra aplicación analiza los ingredientes que tienes en tu 'Despensa' y los compara con nuestra base de datos de recetas. Te mostramos primero las recetas para las que tienes un mayor porcentaje de ingredientes, ayudándote a cocinar con lo que ya tienes.",
  },
  {
    question: "¿Puedo añadir mis propias recetas?",
    answer: "Actualmente, la función para que los usuarios añadan sus propias recetas no está disponible. Sin embargo, es una de las características más solicitadas y nuestro equipo está trabajando para implementarla en una futura actualización.",
  },
  {
    question: "¿Cómo se calculan las calorías?",
    answer: "El valor calórico (kcal) de cada receta es un valor aproximado, calculado por nutricionistas basándose en los ingredientes y las porciones estándar. Es una guía para ayudarte a alcanzar tus metas, pero puede variar ligeramente según los productos específicos que utilices.",
  },
  {
    question: "¿Qué pasa si mis datos de perfil son incorrectos?",
    answer: "Puedes editar la información de tu perfil en cualquier momento. Simplemente ve a la sección 'Mi Perfil' y haz clic en el botón 'Editar' junto al campo que deseas cambiar. Recuerda guardar los cambios cuando termines.",
  },
  {
    question: "La aplicación no funciona correctamente, ¿qué hago?",
    answer: "Si experimentas algún problema, te recomendamos primero refrescar la página. Si el problema persiste, intenta limpiar la caché de tu navegador. Si sigues teniendo dificultades, por favor contacta a nuestro equipo de soporte a través de la sección 'Acerca de'.",
  },
];

const FAQItem = ({ question, answer }) => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  return (
    <animated.div style={props} className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-semibold text-emerald-800 mb-2">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </animated.div>
  );
};

export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald-800">Preguntas Frecuentes (FAQ)</h1>
        <p className="text-slate-600 mt-2">
          Aquí encontrarás respuestas a las dudas más comunes sobre Recetario Verde.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}