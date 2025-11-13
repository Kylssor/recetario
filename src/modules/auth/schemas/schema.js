import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Ingresa tu correo')
    .email('Correo electrónico no válido'),
  password: z.string().nonempty('Ingresa tu contraseña'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Debe tener al menos 2 caracteres'),
  email: z.string().email('Correo inválido').nonempty('Ingresa tu correo'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  calorieGoal: z.coerce
    .number()
    .positive('Ingresa una meta calórica válida (número positivo)'),
  phone: z.string().nonempty('Ingresa un número de teléfono'),
  address: z.string().nonempty('Ingresa una dirección'),
  idNumber: z.string().nonempty('Ingresa un número de identificación'),
})