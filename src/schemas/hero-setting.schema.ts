import z from 'zod'

export const heroSettingSchema = z.object({
  id: z.number(),
  buttonText: z
    .string({ message: 'El buton-text debe ser una cadena de texto' })
    .min(3, 'El button-text debe tener al menos tres caracteres')
    .optional(),
})

export const heroSettingResponseSchema = heroSettingSchema.pick({
  id: true,
  buttonText: true,
})

export const heroSettingDataResponseSchema = z.object({
  heroSetting: heroSettingResponseSchema,
  success: z.boolean(),
})
