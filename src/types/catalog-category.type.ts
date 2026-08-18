import type {
  catalogCategoriesDataResponseSchema,
  catalogCategoryDataResponseSchema,
  catalogCategorySchema,
} from '@/schemas/catalog-category.schema'
import z from 'zod'

export type CatalogCategory = z.infer<typeof catalogCategorySchema>

export type CatalogCategoryCreateForm = Pick<CatalogCategory, 'text'>

export type CatalogCategoryEditForm = Pick<CatalogCategory, 'text' | 'isActive' | 'isDefault'>

export type CatalogCategoryEditFormData = {
  id: CatalogCategory['id']
  data: CatalogCategoryEditForm
}

export type CatalogCategoryDataResponse = z.infer<typeof catalogCategoryDataResponseSchema>

export type CatalogCategoriesDataResponse = z.infer<typeof catalogCategoriesDataResponseSchema>
