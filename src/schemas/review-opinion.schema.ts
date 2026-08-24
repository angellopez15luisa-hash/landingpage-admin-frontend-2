import { z } from 'zod'

export const reviewOpinionSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({
      required_error: 'El campo name es obligatorio',
      invalid_type_error: 'El name debe ser una cadena de texto',
    })
    .min(3, 'El name debe tener al menos tres caracteres')
    .optional(),
  rating: z.coerce
    .number({
      required_error: 'El campo rating es obligatorio',
      invalid_type_error: 'El rating debe ser un numero',
    })
    .int('El rating debe ser un numero entero')
    .min(1, 'El valor minimo es 1')
    .max(5, 'El valor maximo es 5')
    .optional(),
  text: z
    .string({
      required_error: 'El campo text es obligatorio',
      invalid_type_error: 'El text debe ser una cadena de texto',
    })
    .min(3, 'El text debe tener al menos tres caracteres')
    .optional(),
  isActive: z.boolean(),
})

export const reviewOpinionCreateSchema = reviewOpinionSchema.pick({
  name: true,
  rating: true,
  text: true,
  
})

export const reviewOpinionUpdateSchema = reviewOpinionSchema.pick({
  name: true,
  rating: true,
  text: true,
  isActive: true,
})

export const reviewOpinionResponseSchema = reviewOpinionSchema.pick({
  id: true,
  name: true,
  rating: true,
  text: true,
  isActive: true,
})

export const reviewOpinionsResponseSchema = z.array(reviewOpinionResponseSchema)

export const reviewOpinionDataResponseSchema = z.object({
  reviewOpinion: reviewOpinionResponseSchema,
  success: z.boolean(),
})

export const reviewOpinionsDataResponseSchema = z.object({
  reviewOpinions: reviewOpinionsResponseSchema,
  success: z.boolean(),
})
