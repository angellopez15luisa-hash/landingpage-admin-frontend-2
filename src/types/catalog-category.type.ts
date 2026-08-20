import type {
  catalogCategoriesDataResponseSchema,
  catalogCategoryDataResponseSchema,
  catalogCategorySchema,
  catalogCategoryCreateSchema,
} from '@/schemas/catalog-category.schema'
import z from 'zod'

export type CatalogCategory = z.input<typeof catalogCategorySchema>

// Es mejor inferirlo directamente del schema de creación/edición específico
export type CatalogCategoryCreateForm = z.input<typeof catalogCategoryCreateSchema>

// Para editar, puedes crearlo con un pick del baseSchema o definir un schema específico de edición,
// pero si te funciona bien con Pick desde CatalogCategory, déjalo así.
// O una alternativa segura:
export type CatalogCategoryEditForm = {
  text?: string
  isActive?: boolean
  isDefault?: boolean
}

export type CatalogCategoryEditFormData = {
  id: string
  data: CatalogCategoryEditForm
}

export type CatalogCategoryDataResponse = z.input<typeof catalogCategoryDataResponseSchema>

export type CatalogCategoriesDataResponse = z.infer<typeof catalogCategoriesDataResponseSchema>
