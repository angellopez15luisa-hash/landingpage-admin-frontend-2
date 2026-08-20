import { z } from 'zod'

// 1. Esquema base para poder usar .pick() sin errores
export const catalogCategoryBaseSchema = z.object({
  id: z.string().optional(),
  text: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})

// 2. Esquema principal con la validación de isDefault / isActive
export const catalogCategorySchema = catalogCategoryBaseSchema.refine(
  (data) => {
    // Si es predeterminado (isDefault === true), obligatoriamente isActive no puede ser false
    if (data.isDefault && data.isActive === false) {
      return false
    }
    return true
  },
  {
    message: "Una categoría marcada como predeterminada no puede estar inactiva",
    path: ['isActive'],
  }
)

// 3. Schemas derivados usando el baseSchema
export const catalogCategoryCreateSchema = catalogCategoryBaseSchema.pick({
  text: true,
})

export const catalogCategoryResponseSchema = catalogCategoryBaseSchema.pick({
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
