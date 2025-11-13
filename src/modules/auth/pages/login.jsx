import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { Button } from '../../../components/Button'
import {
  Card,
  Input,
  FormTitle,
  ErrorText,
} from '../../../components/Form'

/**
 * Renders the login page using reusable UI components.
 */
export default function Login() {
  const { data, errors, handleChange, handleSubmit } = useLogin()

  return (
    <div className="grid min-h-screen place-items-center bg-emerald-50">
      <Card className="max-w-md">
        <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
          <FormTitle>Iniciar sesión</FormTitle>
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

          {errors.api && <ErrorText className="text-center">{errors.api}</ErrorText>}

          <Button type="submit">Entrar</Button>

          <p className="text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link className="font-semibold text-emerald-600 hover:underline" to="/register">
              Regístrate
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}