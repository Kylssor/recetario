import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import { Button } from '../../../components/Button'
import {
  Card,
  Input,
  FormTitle,
  ErrorText,
} from '../../../components/Form'

/**
 * Renders the registration page using reusable UI components.
 */
export default function Register() {
  const { data, errors, handleChange, handleSubmit } = useRegister()

  return (
    <div className="grid min-h-screen place-items-center bg-emerald-50 py-8">
      <Card className="max-w-md">
        <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
          <FormTitle>Crear cuenta</FormTitle>
          <div>
            <Input
              name="name"
              type="text"
              placeholder="Nombre"
              value={data.name}
              onChange={handleChange}
              required
            />
            {errors.name && <ErrorText className="mt-1">{errors.name}</ErrorText>}
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Correo"
              value={data.email}
              onChange={handleChange}
              required
            />
            {errors.email && <ErrorText className="mt-1">{errors.email}</ErrorText>}
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={data.password}
              onChange={handleChange}
              required
            />
            {errors.password && <ErrorText className="mt-1">{errors.password}</ErrorText>}
          </div>
          <div>
            <Input
              name="calorieGoal"
              type="number"
              placeholder="Meta calórica diaria (kcal)"
              value={data.calorieGoal}
              onChange={handleChange}
              required
            />
            {errors.calorieGoal && <ErrorText className="mt-1">{errors.calorieGoal}</ErrorText>}
          </div>
          <div>
            <Input
              name="phone"
              type="tel"
              placeholder="Número de teléfono"
              value={data.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <ErrorText className="mt-1">{errors.phone}</ErrorText>}
          </div>
          <div>
            <Input
              name="address"
              type="text"
              placeholder="Dirección"
              value={data.address}
              onChange={handleChange}
              required
            />
            {errors.address && <ErrorText className="mt-1">{errors.address}</ErrorText>}
          </div>
          <div>
            <Input
              name="idNumber"
              type="text"
              placeholder="Número de identificación"
              value={data.idNumber}
              onChange={handleChange}
              required
            />
            {errors.idNumber && <ErrorText className="mt-1">{errors.idNumber}</ErrorText>}
          </div>

          {errors.api && <ErrorText className="text-center">{errors.api}</ErrorText>}
          
          <Button type="submit">Registrarme</Button>
          
          <p className="text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link className="font-semibold text-emerald-600 hover:underline" to="/">
              Inicia sesión
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}