import z from 'zod'

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z
    .string({
      message: '* El correo electrónico es requerido', // Mensaje cuando está vacío, undefined o no es string
    })
    .min(1, { message: '* El correo electrónico es requerido' }) // Por si viene como un string vacío ""
    .email({ message: '* Ingresa un correo electrónico válido' })
    .optional(),
  password: z
    .string({
      message: '* La contraseña es requerida', // Cuando no se envía o no es un texto
    })
    .min(1, {
      message: '* La contraseña es requerida', // Por si viene como un string vacío ""
    })
    .min(8, {
      message: '* La contraseña debe tener al menos 8 caracteres', // Cuando escriben menos de 8
    })
    .optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  // Definimos las reglas detalladas aquí para que el pick las herede
  currentPassword: z
    .string({
      message: 'La contraseña actual es requerida',
    })
    .min(1, 'La contraseña actual es requerida')
    .min(8, 'La contraseña actual debe tener al menos 8 caracteres')
    .optional(),

  newPassword: z
    .string({
      message: 'La nueva contraseña es requerida',
    })
    .min(1, 'La nueva contraseña es requerida')
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .optional(),
  token: z.string().min(1, 'El token es obligatorio'),
  frontendUrl:z.string().optional()
})

export const signInSchema = userSchema.pick({
  email: true,
  password: true,
})

// Schema base para el formulario de actualización de contraseña
export const userUpdatePasswordSchema = userSchema
  .pick({
    currentPassword: true,
    newPassword: true,
  })
  .extend({
    confirmPassword: z
      .string({
        message: 'Debes confirmar tu contraseña',
      })
      .min(1, 'Debes confirmar tu contraseña')
      .optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword'],
  })

export const userVerifyResetTokenSchema = userSchema.pick({
  token: true,
})

export const userForgotPasswordSchema = userSchema.pick({
  email: true,
})

export const userResetPasswordSchema = userSchema
  .pick({
    newPassword: true,
  })
  .extend({
    confirmPassword: z
      .string({
        message: 'Debes confirmar tu contraseña',
      })
      .min(1, 'Debes confirmar tu contraseña').optional()

  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const userSignInResponseDataSchema = z.object({
  token: z.string(),
  success: z.boolean(),
})

export const userGetProfileResponseSchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
})

export const userGetProfileResponseDataSchema = z.object({
  success: z.boolean(),
  user: userGetProfileResponseSchema,
})
