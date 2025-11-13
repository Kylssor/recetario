import { useState, useEffect } from 'react'
import api from '../../../utils/api'

/**
 * Hook personalizado para gestionar el historial de consumo calórico del usuario.
 *
 * Encapsula la lógica de obtener el historial completo de consumo calórico del usuario.
 * Gestiona los estados de carga y error.
 *
 * @returns {object} El estado y los manejadores para el gráfico de historial.
 */
export function useCalorieHistory() {
  const [historyData, setHistoryData] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState(null)

  // Obtiene el historial completo de calorías al montar el componente.
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true)
      setHistoryError(null)

      try {
        const response = await api.get('/users/me/full-calorie-history')
        setHistoryData(response.data)
      } catch (error) {
        console.error('Error al cargar el historial de calorías:', error)
        setHistoryError('No se pudo cargar el historial.')
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [])

  return {
    historyData,
    isLoadingHistory,
    historyError,
  }
}