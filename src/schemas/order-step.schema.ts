import z from 'zod'

export const orderStepSchema = z.object({
  id: z.number(),
  number: z
    .string({ message: 'El number debe ser una cadena de texto' })
    .length(2, 'El number debe tener dos caracteres')
    .optional(),
  title: z
    .string({ message: 'El title debe ser una cadena de texto' })
    .min(3, 'El title debe tener al menos tres caracteres')
    .optional(),
  description: z
    .string({ message: 'La description debe ser una cadena de texto' })
    .min(3, 'La description debe tener al menos tres caracteres')
    .optional(),
})

export const orderStepResponseSchema = orderStepSchema.pick({
  id: true,
  number: true,
  title: true,
  description: true,
})

export const orderStepDataResponseSchema = z.object({
  orderStep: orderStepResponseSchema,
  success: z.boolean(),
})

export const orderStepsDataResponseSchema = z.object({
  orderSteps: z.array(orderStepResponseSchema),
  success: z.boolean(),
})
