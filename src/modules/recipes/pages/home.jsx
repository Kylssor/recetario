import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSpring, animated, useTransition } from "@react-spring/web";
import SearchBar from "../components/SearchBar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import DailyPlanner from "../components/DailyPlanner.jsx";
import usePlannerStore from "../../../stores/usePlannerStore.js";

/**
 * Componente principal que muestra el listado de recetas.
 * Presenta una vista introductoria si no hay búsqueda activa.
 * Al realizar una búsqueda, filtra y muestra las recetas correspondientes.
 */
export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanner = usePlannerStore((state) => state.fetchPlanner);
  const location = useLocation();

  /**
   * Resuelve la URL de la imagen de una receta.
   * Utiliza `import.meta.url` para crear una URL válida que Vite puede procesar.
   * @param {string} imageName El nombre del archivo de la imagen.
   * @returns {string} La URL completa y procesada de la imagen.
   */
  const getImageUrl = (imageName) => {
    if (!imageName) return ''; // Manejar recetas sin imagen
    return new URL(`../../../assets/recipes/${imageName}`, import.meta.url).href;
  };

  // Efecto para la carga inicial de datos (receta recomendada y planificador)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Iniciar ambas peticiones en paralelo para mayor eficiencia.
        const recommendedPromise = axios.get("http://localhost:3001/api/recipes");
        const plannerPromise = fetchPlanner();

        const [response] = await Promise.all([recommendedPromise, plannerPromise]);

        if (response.data.length > 0) {
          const firstRecipe = {
            ...response.data[0],
            image: getImageUrl(response.data[0].image),
          };
          setRecommended(firstRecipe);
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };
    // Se llama a fetchInitialData solo si fetchPlanner está definido (es decir, el store está listo).
    if (fetchPlanner) {
      fetchInitialData();
    }
  }, [fetchPlanner]);

  // Efecto para reiniciar la búsqueda al navegar desde el menú
  useEffect(() => {
    if (location?.state?.reset) {
      setRecipes([]);
    }
  }, [location?.state]);

  // Define la animación de entrada para la sección de introducción.
  const intro = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  /**
   * Gestiona la lógica de búsqueda de recetas por ingrediente llamando a la API.
   * Si el término de búsqueda está vacío, reinicia el estado de las recetas.
   */
  const handleSearch = async (ingredient) => {
    const trimmed = ingredient.trim().toLowerCase();
    if (!trimmed) {
      setRecipes([]);
      return;
    }


    try {
      const response = await axios.get(
        `http://localhost:3001/api/recipes/search?ingredient=${trimmed}`
      );
      console.log("Resultados de la búsqueda:", response.data);
      // Procesa las URLs de las imágenes para cada receta encontrada
      const recipesWithImageUrls = response.data.map((recipe) => ({
        ...recipe,
        image: getImageUrl(recipe.image),
      }));
      setRecipes(recipesWithImageUrls);
    } catch (error) {
      console.error("Error al buscar recetas:", error);
    }
  };

  // Define las transiciones animadas para la lista de resultados de búsqueda.
  const transitions = useTransition(recipes, {
    from: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -15 },

    key: (item) => item.id, // Usa el ID de la receta como clave única
    exitBeforeEnter: true,
  });

  return (
    <div className="space-y-8">
      {/* Sección de introducción */}
      <animated.div style={intro} className="space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-800">Recetario saludable y económico</h1>
        <p className="text-slate-700">
          Nuestro objetivo es ofrecer recetas fáciles, nutritivas y al alcance de todos. Busca por ingrediente y descubre
          deliciosas combinaciones.
        </p>
      </animated.div>
      {/* Barra de búsqueda */}
      <SearchBar onSelect={handleSearch} />

      {/* Planificador diario */}
      <div className="mt-8">
        <DailyPlanner />
      </div>
      
      {/* Renderizado condicional de contenido */}
      {recipes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Tarjeta de objetivo */}
          <animated.div style={intro} className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">Nuestro objetivo</h2>
            <p className="text-slate-700 flex-1">
              Esta plataforma nace para simplificar la búsqueda de recetas saludables y económicas. Queremos inspirarte a
              cocinar con ingredientes simples que probablemente ya tienes en casa.
            </p>
          </animated.div>
          {/* Tarjeta de receta recomendada */}
          <animated.div style={intro} className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">Receta recomendada</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : recommended ? (
              <RecipeCard recipe={recommended} />
            ) : (
              <p>No hay recetas para recomendar.</p>
            )}
          </animated.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {transitions((style, item) => (
            <animated.div style={style} key={item.id}>
              <RecipeCard recipe={item} />
            </animated.div>
          ))}
        </div>
      )}
    </div>
  );
}