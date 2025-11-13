import { Link } from 'react-router-dom'
import { useSpring, animated } from '@react-spring/web'
import CalorieHistoryChart from '../components/CalorieHistoryChart'
import PantryManager from '../components/PantryManager.jsx'
import { useUserProfile } from '../hooks/useUserProfile.js'
import { useCalorieHistory } from '../hooks/useCalorieHistory.js'
import { Button } from '../../../components/Button.jsx'
import { Card, Input, ErrorText } from '../../../components/Form'

/**
 * Componente de la página de perfil.
 * 
 * Renderiza la información del usuario, la despensa de ingredientes y el historial
 * de calorías. Utiliza el `useUserProfile` hook para gestionar el estado y la lógica.
 */
export default function Profile() {
  const {
    user,
    editingField,
    formData,
    isSaving,
    saveError,
    fieldErrors,
    handleEditField,
    handleCancel,
    handleChange,
    handleSubmit,
    pantry,
    updatePantry,
  } = useUserProfile()

  const {
    historyData,
    isLoadingHistory,
    historyError,
  } = useCalorieHistory()

  const profileAnimation = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  })

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50">
        <Card className="max-w-md">
          <div className="text-center">
            <p className="mb-4 text-slate-700">No hay sesión activa.</p>
            <Link
              to="/"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
      {/* Columna Izquierda: Perfil e Historial */}
      <div className="flex flex-col gap-6">
        {/* Tarjeta de Perfil del Usuario */}
        <animated.div style={profileAnimation}>
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full border object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-semibold text-emerald-800">
                      {user.name}
                    </h1>
                    <p className="text-slate-700">{user.email}</p>
                  </div>
                </div>

                {saveError && (
                  <ErrorText className="text-center">{saveError}</ErrorText>
                )}

                <EditableField
                  label="Nombre"
                  name="name"
                  value={formData.name || ''}
                  isEditing={editingField === 'name'}
                  onChange={handleChange}
                  onEdit={() => handleEditField('name')}
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                  isSaving={isSaving}
                  error={fieldErrors.name}
                />
                <EditableField
                  label="Meta calórica diaria (kcal)"
                  name="calorieGoal"
                  type="number"
                  value={formData.calorieGoal || ''}
                  isEditing={editingField === 'calorieGoal'}
                  onChange={handleChange}
                  onEdit={() => handleEditField('calorieGoal')}
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                  isSaving={isSaving}
                  error={fieldErrors.calorieGoal}
                />
                <EditableField
                  label="Número de teléfono"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  isEditing={editingField === 'phone'}
                  onChange={handleChange}
                  onEdit={() => handleEditField('phone')}
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                  isSaving={isSaving}
                  error={fieldErrors.phone}
                />
                <EditableField
                  label="Dirección"
                  name="address"
                  value={formData.address || ''}
                  isEditing={editingField === 'address'}
                  onChange={handleChange}
                  onEdit={() => handleEditField('address')}
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                  isSaving={isSaving}
                  error={fieldErrors.address}
                />
                <EditableField
                  label="Identificación"
                  name="idNumber"
                  value={formData.idNumber || ''}
                  isEditing={editingField === 'idNumber'}
                  onChange={handleChange}
                  onEdit={() => handleEditField('idNumber')}
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                  isSaving={isSaving}
                  error={fieldErrors.idNumber}
                />


              </div>
            </form>
          </Card>
        </animated.div>

        {/* Tarjeta de Historial de Calorías */}
        <animated.div style={profileAnimation}>
          <Card className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-emerald-800">
                Historial de Calorías
              </h3>
            </div>
            {isLoadingHistory ? (
              <p className="text-center text-slate-500">
                Cargando historial...
              </p>
            ) : historyError ? (
              <ErrorText className="text-center">{historyError}</ErrorText>
            ) : historyData.length > 0 ? (
              <div className="relative h-64 w-full">
                <CalorieHistoryChart
                  historyData={historyData}
                  calorieGoal={user.calorieGoal}
                />
              </div>
            ) : (
              <p className="text-center text-slate-500">
                No hay datos en el historial para mostrar.
              </p>
            )}
          </Card>
        </animated.div>
      </div>

      {/* Columna Derecha: Despensa */}
      <animated.div style={profileAnimation}>
        <Card>
          <PantryManager
            initialPantry={pantry}
            onSave={updatePantry}
            isSaving={isSaving}
          />
        </Card>
      </animated.div>
    </div>
  )
}

// Componente de ayuda para renderizar una fila de datos editable.
// Se mantiene en este archivo porque está estrechamente acoplado a la lógica de `Profile`.
function EditableField({
  label,
  name,
  value,
  isEditing,
  onChange,
  onEdit,
  onCancel,
  onSave,
  isSaving,
  error,
  type = 'text',
}) {
  return (
    <div className="border-t py-4">
      <div className="flex justify-between items-start">
        <div>
          <label className="text-sm font-medium text-emerald-700">{label}</label>
          {!isEditing && (
            <p className="text-slate-700">{value}{name === 'calorieGoal' && ' kcal'}</p>
          )}
        </div>
        {!isEditing && (
          <Button variant="link" onClick={onEdit} className="text-sm p-0">
            Editar
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="mt-2 space-y-3">
          <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            autoFocus
          />
          {error && <ErrorText className="mt-1 text-left">{error}</ErrorText>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
