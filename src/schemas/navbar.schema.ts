import { z } from 'zod'

export const navbarSchema = z.object({
  id: z.number(),
  textLogo: z
    .string({ message: 'El text-logo debe ser una cadena de texto' })
    .min(3, '* El text-logo debe tener al menos tres caracteres')
    .optional(),
  hrefLogo: z
    .string({ message: 'el href-logo debe ser una cadena de texto' })
    .min(3, '* El href-logo debe tener al menos tres caracteres')
    .optional(),
  textBtn: z
    .string({ message: 'El text-btn debe ser una cadena de texto' })
    .min(3, '* El text-btn debe tener al menos tres caracteres')
    .optional(),
  hrefBtn: z
    .string({ message: 'El href-btn debe ser una cadena de texto' })
    .min(3, '* El href-btn debe tener al menos tres caracteres')
    .optional(),
})

export const navbarResponseSchema = navbarSchema.pick({
  id: true,
  textLogo: true,
  hrefLogo: true,
  textBtn: true,
  hrefBtn: true,
})

export const navbarDataResponseSchema = z.object({
  navbar: navbarResponseSchema,
  success: z.boolean(),
})
