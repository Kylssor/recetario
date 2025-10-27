import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

// Tarjeta de receta con animación de rotación 3D. Muestra los datos
// principales en la cara frontal y las instrucciones en la cara trasera.
export default function RecipeCard({ recipe }) {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    transform: `rotateY(${flipped ? 180 : 0}deg)`,
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
      className="relative w-full h-60 md:h-64 lg:h-72 perspective-[1000px] cursor-pointer"
    >
      <animated.div
        style={{ opacity, transform, backfaceVisibility: "hidden" }}
        className="absolute inset-0 bg-white rounded-2xl shadow p-4 flex flex-col justify-between"
      >
        <h3 className="text-lg font-semibold text-emerald-800 line-clamp-2">
          {recipe.title}
        </h3>
        <p className="text-sm text-slate-600 flex-1 mt-1 line-clamp-2">
          {recipe.description}
        </p>
        <div className="mt-3 flex gap-3 text-xs text-slate-500">
          <span>{recipe.kcal} kcal</span>
          <span>{recipe.time}</span>
          <span>{recipe.level}</span>
        </div>
      </animated.div>
      <animated.div
        style={{
          opacity: backOpacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
          backfaceVisibility: "hidden",
        }}
        className="absolute inset-0 bg-emerald-50 rounded-2xl shadow p-4 overflow-auto"
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