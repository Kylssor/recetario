import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSpring, animated, useTransition } from "@react-spring/web";
import SearchBar from "../components/SearchBar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

// Importar imágenes locales para las recetas. Estas imágenes deben existir en
// src/assets/recipes con los nombres indicados. Si las imágenes no existen,
// puedes reemplazar estas importaciones con enlaces remotos o nuevas rutas.
import ensaladaImg from '../../../assets/recipes/EnsaladadePollo.jpg';
import tortillaImg from '../../../assets/recipes/TortilladeEspinaca.jpg';
import sopaLentejasImg from '../../../assets/recipes/SopaLentejas.jpg';
import smoothieImg from '../../../assets/recipes/SmoothiedeAvenayFrutos.jpg';
import quinoaImg from '../../../assets/recipes/SalteadodeQuinoa.jpg';
import huevosImg from '../../../assets/recipes/HuevoRevuelto.jpg';

/**
 * Página principal de recetas. Si el usuario no ha realizado una búsqueda,
 * muestra una sección introductoria con el objetivo del proyecto y una
 * receta recomendada. Al buscar un ingrediente, filtra las recetas
 * simuladas y las presenta como tarjetas animadas.
 */
export default function Home() {
  const [recipes, setRecipes] = useState([]);
  // Detectar si se debe reiniciar la vista al navegar desde el menú
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.reset) {
      setRecipes([]);
    }
  }, [location?.state]);

  // Animación para la sección de introducción y recomendaciones
  const intro = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  /**
   * Recetas simuladas. Cada una incluye una imagen desde Unsplash basada en su contenido.
   * Las imágenes son enlaces que devuelven una foto aleatoria adecuada al tema.
   */
  const MOCK_RECIPES = [
    {
      title: "Ensalada de pollo y vegetales",
      description: "Receta ligera y saludable de pollo con vegetales frescos.",
      kcal: 350,
      time: "20 min",
      level: "Fácil",
      ingredients: ["pollo", "lechuga", "tomate", "pepino"],
      steps: [
        // Cocina el pollo con tiempos y cantidades claros
        "Cocina 1 pechuga de pollo a la plancha a fuego medio durante 6–8 minutos por cada lado hasta que esté bien cocida y córtala en tiras",
        // Prepara las verduras
        "Lava y trocea 2 tazas de lechuga, 1 tomate y 1/2 pepino",
        // Mezcla los ingredientes
        "Mezcla todos los ingredientes en un bol grande",
        // Aliña la ensalada
        "Añade 1 cucharada de aceite de oliva, una pizca de sal y el jugo de medio limón al gusto",
      ],
      // La imagen ahora apunta a un recurso local importado. Si no dispones de
      // esta imagen local, puedes sustituirla por una URL remota.
      image: ensaladaImg,
    },
    {
      title: "Tortilla de espinacas",
      description: "Ideal para desayunar o una cena ligera con huevo y espinacas.",
      kcal: 250,
      time: "15 min",
      level: "Fácil",
      ingredients: ["huevo", "espinaca", "cebolla"],
      steps: [
        // Batir los huevos
        "Bate 2 huevos en un bol con una pizca de sal y pimienta",
        // Saltear la espinaca y cebolla
        "Saltea 1 taza de espinaca y 1/4 de cebolla picada en una sartén antiadherente con 1 cucharadita de aceite durante 2 minutos",
        // Añadir los huevos y cocinar
        "Añade los huevos batidos y cocina a fuego medio durante 3–4 minutos hasta que cuaje",
        // Dar la vuelta
        "Voltea la tortilla con cuidado y cocina 1 minuto más antes de servir",
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
        // Preparar las lentejas
        "Enjuaga 1 taza de lentejas y ponlas a cocer en 4 tazas de agua en una olla",
        // Agregar verduras
        "Añade 1 zanahoria picada, 1 papa en cubos y 1/2 cebolla picada",
        // Cocinar a fuego medio
        "Deja hervir a fuego medio durante 30 minutos o hasta que las lentejas estén tiernas",
        // Ajustar condimentos
        "Ajusta la sal al gusto y sirve caliente",
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
        // Remojar la avena
        "Remoja 1/4 de taza de avena en 1/2 taza de leche durante 5 minutos",
        // Licuar ingredientes
        "Licúa la avena remojada con 1 banana y 1/2 taza de frutos rojos",
        // Añadir hielo
        "Añade 1/2 taza de hielo y licúa nuevamente hasta obtener una textura suave",
        // Servir
        "Sirve frío inmediatamente y disfruta",
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
        // Cocinar la quinoa
        "Cocina 1 taza de quinoa según las indicaciones del paquete (aproximadamente 15 minutos en agua hirviendo)",
        // Saltear las verduras
        "Saltea 1 zanahoria en tiras, 1 taza de brócoli en floretes y 1/2 pimiento en tiras en una sartén con 1 cucharada de aceite durante 5 minutos",
        // Integrar la quinoa
        "Añade la quinoa cocida y mezcla bien",
        // Condimentar
        "Condimenta con sal, pimienta y 2 cucharadas de salsa de soja ligera; cocina 2 minutos más y sirve",
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
        // Preparar ingredientes
        "Pica 1 tomate mediano y 1/4 de cebolla finamente",
        // Batir los huevos
        "Bate 2 huevos en un bol con una pizca de sal",
        // Saltear verduras
        "Saltea la cebolla y el tomate en una sartén con 1 cucharadita de aceite durante 2–3 minutos hasta que se ablanden",
        // Cocinar los huevos
        "Añade los huevos batidos y revuelve suavemente a fuego medio hasta que cuajen (aproximadamente 2–3 minutos)",
      ],
      image: huevosImg,
    },
  ];

  /**
   * Maneja la búsqueda de un ingrediente y actualiza las recetas a mostrar.
   * Filtra las recetas comprobando si el término aparece en su lista de ingredientes.
   * Si no hay término, borra los resultados para mostrar la sección introductoria.
   */
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

  // Elegimos la primera receta como recomendada cuando no hay búsqueda
  const recommended = MOCK_RECIPES[0];

  // Animación para la lista de resultados
  const transitions = useTransition(recipes, {
    from: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -15 },
    trail: 100,
  });

  return (
    <div className="space-y-8">
      {/* Sección introductoria */}
      <animated.div style={intro} className="space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-800">Recetario saludable y económico</h1>
        <p className="text-slate-700">
          Nuestro objetivo es ofrecer recetas fáciles, nutritivas y al alcance de todos. Busca por ingrediente y descubre
          deliciosas combinaciones.
        </p>
      </animated.div>
      {/* Barra de búsqueda */}
      <SearchBar onSelect={handleSearch} />
      {/* Contenido condicional */}
      {recipes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Objetivo */}
          <animated.div style={intro} className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">Nuestro objetivo</h2>
            <p className="text-slate-700 flex-1">
              Esta plataforma nace para simplificar la búsqueda de recetas saludables y económicas. Queremos inspirarte a
              cocinar con ingredientes simples que probablemente ya tienes en casa.
            </p>
          </animated.div>
          {/* Receta recomendada */}
          <animated.div style={intro} className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">Receta recomendada</h2>
            <RecipeCard recipe={recommended} />
          </animated.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {transitions((style, item) => (
            <animated.div style={style} key={item.title}>
              <RecipeCard recipe={item} />
            </animated.div>
          ))}
        </div>
      )}
    </div>
  );
}