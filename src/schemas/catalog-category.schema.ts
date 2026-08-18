import z from 'zod'

export const catalogCategorySchema = z.object({
  id: z.number(),
  text: z
    .string({ message: '* El nombre debe ser una cadena de texto' })
    .min(3, '* EL nombre debe tener al menos 3 caracteres')
    .optional(),
  isActive: z
    .boolean({
      message: '* El campo is-active debe ser un booleano valido',
    })
    .optional(),
  isDefault: z
    .boolean({
      message: '* El campo is-default debe ser un booleano valido',
    })
    .optional(),
})

export const catalogCategoryCreateSchema = catalogCategorySchema.pick({
  text: true,
})

export const catalogCategoryResponseSchema = catalogCategorySchema
  .pick({
    id: true,
    text: true,
    isActive: true,
    isDefault: true,
  })

export const catalogCategoryDataResponseSchema = z.object({
  catalogCategory: catalogCategoryResponseSchema,
  success: z.boolean(),
})

export const catalogCategoriesDataResponseSchema = z.object({
  catalogCategories: z.array(catalogCategoryResponseSchema),
  success: z.boolean(),
})
