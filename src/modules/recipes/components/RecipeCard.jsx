import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

/**
 * Tarjeta de receta con animación de voltear.
 *
 * Muestra la receta en dos caras: la frontal presenta una imagen, nombre,
 * descripción breve y datos nutricionales; al hacer clic se rota para
 * mostrar la lista de pasos de preparación. Utiliza propiedades optimizadas
 * (`opacity` y `transform`) para lograr una animación suave.
 */
export default function RecipeCard({ recipe }) {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    transform: `perspective(1000px) rotateY(${flipped ? 180 : 0}deg)`,
    opacity: flipped ? 0 : 1,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  const { opacity: backOpacity } = useSpring({
    opacity: flipped ? 1 : 0,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div
      onClick={() => setFlipped((state) => !state)}
      className="relative w-full h-72 cursor-pointer select-none"
    >
      {/* Cara frontal */}
      <animated.div
        style={{ opacity, transform, backfaceVisibility: "hidden" }}
        className="absolute inset-0 bg-white rounded-2xl shadow overflow-hidden"
      >
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-32 object-cover rounded-t-2xl"
          />
        )}
        <div className="p-4 h-40 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-emerald-800">
              {recipe.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {recipe.description}
            </p>
          </div>
          <div className="mt-2 flex gap-2 text-xs text-slate-500">
            <span>{recipe.kcal} kcal</span>
            <span>{recipe.time}</span>
            <span>{recipe.level}</span>
          </div>
        </div>
      </animated.div>
      {/* Cara trasera */}
      <animated.div
        style={{
          opacity: backOpacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
          backfaceVisibility: "hidden",
        }}
        className="absolute inset-0 bg-emerald-50 rounded-2xl shadow overflow-auto p-4"
      >
        <h4 className="font-semibold text-emerald-700 mb-2">Instrucciones</h4>
        <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </animated.div>
    </div>
  );
}
