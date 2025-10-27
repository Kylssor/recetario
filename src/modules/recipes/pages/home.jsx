import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import ensaladaImg from '../../../assets/recipes/EnsaladadePollo.jpg';
import tortillaImg from '../../../assets/recipes/TortilladeEspinaca.jpg';
import sopaLentejasImg from '../../../assets/recipes/SopaLentejas.jpg';
import smoothieImg from '../../../assets/recipes/SmoothiedeAvenayFrutos.jpg';
import quinoaImg from '../../../assets/recipes/SalteadodeQuinoa.jpg';
import huevosImg from '../../../assets/recipes/HuevoRevuelto.jpg';


/**
 * Página principal del recetario.
 *
 * Permite buscar recetas por ingrediente mediante un buscador con sugerencias.
 * Cuando no se realiza una búsqueda, muestra el objetivo del proyecto y una
 * receta recomendada. Al ingresar un ingrediente se filtran las recetas
 * existentes y se muestran en una cuadrícula animada.
 */
export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const intro = useSpring({
    from: { opacity: 0, y: 12 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });
  // Datos de recetas simuladas. Puedes reemplazar las imágenes por
  // archivos locales colocando las imágenes en `src/assets/recipes` y
  // importándolas arriba.
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
    image: ensaladaImg, // <- aquí usas la importación correspondiente
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
    image: tortillaImg,
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
    image: sopaLentejasImg,
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
    image: smoothieImg,
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
    image: quinoaImg,
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
    image: huevosImg,
  },
];
  const recommended = MOCK_RECIPES[0];

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
    <div className="space-y-10">
      <animated.div style={intro} className="space-y-3">
        <h1 className="text-3xl font-bold text-emerald-800">
          Bienvenido al Recetario Verde
        </h1>
        <p className="text-slate-700">
          Busca recetas saludables y económicas escribiendo un ingrediente
          en el buscador.
        </p>
      </animated.div>
      <SearchBar onSelect={handleSearch} />
      {recipes.length === 0 ? (
        <section className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-semibold text-emerald-800">
              Nuestro objetivo
            </h2>
            <p className="text-slate-700">
              Este proyecto busca ayudarte a encontrar recetas saludables y
              económicas a partir de los ingredientes que tienes a mano. Al
              registrarte, podrás guardar tus preferencias y recibir
              recomendaciones personalizadas.
            </p>
            <p className="text-slate-700">
              Explora nuestra receta recomendada para empezar y descubre la
              variedad de opciones que tenemos para ti.
            </p>
          </div>
          <div className="flex-1 max-w-sm w-full">
            <RecipeCard recipe={recommended} />
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, idx) => (
            <RecipeCard key={idx} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
