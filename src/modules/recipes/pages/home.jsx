import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";

// Esta versión consolidada de Home para entrega incluye un buscador
// con filtros por ingrediente y una cuadrícula de tarjetas animadas.
export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const intro = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });
  const MOCK_RECIPES = [
    {
      title: "Ensalada de pollo y vegetales",
      description: "Receta ligera y saludable de pollo con vegetales frescos.",
      kcal: 350,
      time: "20 min",
      level: "Fácil",
      ingredients: ["pollo", "lechuga", "tomate", "pepino"],
      steps: [
        "Cocina el pollo a la plancha y córtalo en tiras",
        "Lava y trocea la lechuga, el tomate y el pepino",
        "Mezcla todos los ingredientes en un bol",
        "Añade aceite de oliva, sal y limón al gusto",
      ],
    },
    {
      title: "Tortilla de espinacas",
      description: "Ideal para desayunar o una cena ligera con huevo y espinacas.",
      kcal: 250,
      time: "15 min",
      level: "Fácil",
      ingredients: ["huevo", "espinaca", "cebolla"],
      steps: [
        "Bate los huevos en un bol con sal y pimienta",
        "Saltea la espinaca y la cebolla en una sartén",
        "Añade los huevos batidos y cocina hasta cuajar",
        "Voltea la tortilla con cuidado y termina la cocción",
      ],
    },
    {
      title: "Sopa de lentejas",
      description: "Sopa reconfortante con lentejas y verduras, económica y nutritiva.",
      kcal: 300,
      time: "40 min",
      level: "Media",
      ingredients: ["lentejas", "zanahoria", "papa", "cebolla"],
      steps: [
        "Enjuaga las lentejas y ponlas a cocer en agua",
        "Añade zanahoria, papa y cebolla troceadas",
        "Deja hervir a fuego medio durante 30 minutos",
        "Ajusta sal y sirve caliente",
      ],
    },
    {
      title: "Smoothie de avena y frutas",
      description: "Bebida nutritiva con avena, banana y frutos rojos.",
      kcal: 200,
      time: "10 min",
      level: "Fácil",
      ingredients: ["avena", "banana", "frutos rojos", "leche"],
      steps: [
        "Remoja la avena en leche durante 5 minutos",
        "Licúa la avena con banana y frutos rojos",
        "Añade hielo y licúa nuevamente",
        "Sirve frío y disfruta",
      ],
    },
    {
      title: "Salteado de quinoa con verduras",
      description: "Plato completo y ligero a base de quinoa y vegetales.",
      kcal: 400,
      time: "25 min",
      level: "Media",
      ingredients: ["quinoa", "zanahoria", "brócoli", "pimiento"],
      steps: [
        "Cocina la quinoa según indicaciones del paquete",
        "Saltea las verduras en una sartén hasta que estén tiernas",
        "Añade la quinoa cocida y mezcla bien",
        "Condimenta con sal, pimienta y salsa de soja ligera",
      ],
    },
    {
      title: "Huevos revueltos con tomate",
      description: "Receta rápida y económica para un desayuno completo.",
      kcal: 220,
      time: "10 min",
      level: "Fácil",
      ingredients: ["huevo", "tomate", "cebolla"],
      steps: [
        "Pica el tomate y la cebolla finamente",
        "Bate los huevos en un bol",
        "Saltea la cebolla y el tomate hasta que se ablanden",
        "Añade los huevos batidos y revuelve hasta cuajar",
      ],
    },
  ];
  const handleSearch = (ingredient) => {
    const trimmed = ingredient.trim().toLowerCase();
    if (!trimmed) {
      setRecipes([]);
      return;
    }
    const results = MOCK_RECIPES.filter((r) =>
      r.ingredients.some((ing) => ing.toLowerCase().includes(trimmed))
    );
    setRecipes(results);
  };
  return (
    <div className="space-y-8">
      <animated.div style={intro} className="space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-800">
          Busca tu receta favorita
        </h1>
        <p className="text-slate-700">
          Ingresa un ingrediente para ver recetas saludables y económicas.
        </p>
      </animated.div>
      <SearchBar onSelect={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length === 0 ? (
          <p className="col-span-full text-slate-600 italic">
            No hay recetas para mostrar…
          </p>
        ) : (
          recipes.map((recipe, idx) => (
            <RecipeCard key={idx} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );
}