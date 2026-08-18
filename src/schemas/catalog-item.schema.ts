import z from 'zod'
import { catalogCategoryResponseSchema } from './catalog-category.schema'

export const catalogItemSchema = z.object({
  id: z.number(),
  title: z
    .string({ message: 'El title debe ser una cadena de texto' })
    .min(3, '* El titulo debe tener al menos tres caracteres')
    .optional(),
  catalogCategoryId: z.coerce
    .number({
      message: '* El catalogCategoryId debe ser un numero',
    })
    .int('* El catalogCategoryId debe ser un numero entero')
    .refine((val) => val > 0, {
      message: 'Debes seleccionar una categoría',
    })
    .optional(),
  price: z
    .union([z.string(), z.number()])
    .refine((val) => val !== null && val !== undefined && String(val).trim() !== '', {
      message: '* El campo es requerido',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: '* Debe ser un número',
    })
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
      message: '* Debe ser mayor a cero',
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), {
      message: '* Debe tener como máximo dos decimales',
    }),
  imagePath: z.string().optional(),
  badge: z
    .string({ message: '* El badge debe ser una cadena de texto' })
    .min(3, '* El badge debe tener al menos tres caracteres ')
    .optional(),
  isActive: z
    .boolean({
      message: '* El campo is-active debe ser un booleano valido',
    })
    .optional(),
  catalogCategory: catalogCategoryResponseSchema.optional(),
})

export const catalogItemCreateSchema = catalogItemSchema.pick({
  title: true,
  catalogCategoryId: true,
  price: true,
  imagePath: true,
  badge: true,
})

export const catalogItemUpdateSchema = catalogItemSchema.pick({
  title: true,
  catalogCategoryId: true,
  price: true,
  imagePath: true,
  badge: true,
  isActive: true,
})

export const catalogItemResponseSchema = catalogItemSchema.pick({
  id: true,
  title: true,
  catalogCategoryId: true,
  price: true,
  imagePath: true,
  badge: true,
  isActive: true,
  catalogCategory: true,
})

export const catalogItemDataResponseSchema = z.object({
  catalogItem: catalogItemResponseSchema,
  success: z.boolean(),
})

export const catalogItemsDataResponseSchema = z.object({
  catalogItems: z.array(catalogItemResponseSchema),
  success: z.boolean(),
})
