import { useState, useEffect } from 'react';

/**
 * Hook personalizado para obtener la configuración regional (locale) del navegador.
 * Proporciona un valor predeterminado y se actualiza de forma segura solo en el lado del cliente.
 * @returns {string} La configuración regional del navegador, ej: 'es-ES', 'en-US'.
 */
export default function useLocale() {
  // Inicializa con un valor por defecto o el del navegador si ya está disponible (SSR/prerendering).
  const [locale, setLocale] = useState(
    typeof navigator !== 'undefined' ? navigator.language : 'en-US'
  );

  useEffect(() => {
    // Asegura que el código se ejecute solo en el cliente.
    if (typeof navigator !== 'undefined' && navigator.language) {
      setLocale(navigator.language);
    }
  }, []); // Se ejecuta solo una vez al montar el componente.

  return locale;
}