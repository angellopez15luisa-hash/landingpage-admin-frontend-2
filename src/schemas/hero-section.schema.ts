import z from 'zod'

export const heroSectionSchema = z.object({
  id: z.number(),
  imagePath:z.string(),
  tag: z
    .string({ error: '* El tag debe ser una cadena de texto' })
    .min(3, '* El tag debe tener al menos tres caracteres')
    .optional(),
  title: z
    .string({ error: '* El title debe ser una cadena de texto' })
    .min(3, '* El title debe tener al menos tres caracteres')
    .optional(),
  highlightText: z
    .string({ error: '* El highlightText debe ser una cadena de texto' })
    .min(3, '* El highlightText debe tener al menos tres caracteres')
    .optional(),
  description: z
    .string({ error: '* La description debe ser una cadena de texto' })
    .min(3, '* La description debe tener al menos tres caracteres')
    .optional(),
})
export const heroSectionResponseSchema = heroSectionSchema.pick({
  id: true,
  imagePath:true,
  tag: true,
  title: true,
  highlightText: true,
  description: true,
})

export const heroSectionDataResponseSchema = z.object({
  heroSection: heroSectionResponseSchema,
  success: z.boolean(),
})

export const heroSectionsDataResponseSchema = z.object({
  heroSections: z.array(heroSectionResponseSchema),
  success: z.boolean(),
})
