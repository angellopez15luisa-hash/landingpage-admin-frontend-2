import type {
  catalogItemDataResponseSchema,
  catalogItemSchema,
  catalogItemsDataResponseSchema,
} from '@/schemas/catalog-item.schema'
import z from 'zod'

export type CatalogItem = z.input<typeof catalogItemSchema>

export type CatalogItemCreateForm = Pick<
  CatalogItem,
  'title' | 'catalogCategoryId' | 'price' | 'badge' | 'imagePath'
>

export type CatalogItemEditForm = Pick<
  CatalogItem,
  'title' | 'catalogCategoryId' | 'price' | 'badge' | 'isActive' | 'imagePath'
>

export type CatalogItemEditFormData = {
  id: CatalogItem['id']
  data: FormData
}

export type CatalogItemDataResponse = z.infer<typeof catalogItemDataResponseSchema>

export type CatalogItemsDataResponse = z.infer<typeof catalogItemsDataResponseSchema>
