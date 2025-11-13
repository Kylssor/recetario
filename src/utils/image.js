/**
 * Resuelve la URL de la imagen de una receta.
 * Si la receta no tiene una imagen propia, genera una imagen de placeholder
 * consistente usando Picsum Photos, basada en el título de la receta.
 *
 * @param {string | null} imageName - El nombre del archivo de la imagen.
 * @param {string} [title='recipe'] - El título de la receta, usado como "seed" para la imagen.
 * @returns {string} La URL completa de la imagen (local o de Picsum).
 */
export const getImageUrl = (imageName, title = 'recipe') => {
  if (imageName) {
    // Si hay un nombre de imagen, construye la ruta al asset local.
    return new URL(`../assets/recipes/${imageName}`, import.meta.url).href;
  }
  
  // Si no hay imagen, usa el título para generar una URL de Picsum consistente.
  // Se reemplazan los espacios para crear un 'seed' válido para la URL.
  const seed = encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase());
  return `https://picsum.photos/seed/${seed}/400/300`;
};