import z from 'zod'

export const itemSectionSchema = z.object({
  id: z.number(),
  text: z
    .string({ message: '* El text debe ser una cadena de texto' })
    .min(3, '* El text debe tener al menos tres caracteres')
    .optional(),
  href: z
    .string({ message: 'El href debe ser una cadena de texto' })
    .min(3, '* El href debe tener al menos tres caracteres')
    .optional(),
  flagNavbar: z
    .boolean({
      message: '* El campo flag-navbar debe ser un booleano valido',
    })
    .optional(),
  flagFooter: z
    .boolean({
      message: '* El campo flag-footer debe ser un booleano valido',
    })
    .optional(),
})

export const itemSectionResponseSchema = itemSectionSchema.pick({
  id: true,
  text: true,
  href: true,
  flagNavbar: true,
  flagFooter: true,
})

export const itemSectionDataResponseSchema = z.object({
  itemSection: itemSectionResponseSchema,
  success: z.boolean(),
})

export const itemSectionsDataResponseSchema = z.object({
  itemSections: z.array(itemSectionResponseSchema),
  success: z.boolean(),
})
