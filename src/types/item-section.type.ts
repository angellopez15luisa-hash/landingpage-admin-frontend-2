import type {
  itemSectionsDataResponseSchema,
  itemSectionSchema,
  itemSectionDataResponseSchema,
} from '@/schemas/item-section.schema'
import z from 'zod'

export type ItemSection = z.infer<typeof itemSectionSchema>

export type ItemSectionEditForm = Pick<ItemSection, 'text' | 'href' | 'flagNavbar' | 'flagFooter'>

export type ItemSectionEditFormData = {
  id: ItemSection['id']
  data: ItemSectionEditForm
}

export type ItemSectionsDataResponse = z.infer<typeof itemSectionsDataResponseSchema>

export type ItemSectionDataResponse = z.infer<typeof itemSectionDataResponseSchema>


