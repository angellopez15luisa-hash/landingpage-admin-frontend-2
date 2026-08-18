import { isAxiosError } from 'axios'
import { ItemSectionApi } from '../apis'
import {
  itemSectionDataResponseSchema,
  itemSectionsDataResponseSchema,
} from '@/schemas/item-section.schema'
import type { ItemSection, ItemSectionEditFormData } from '@/types/item-section.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class ItemSectionService {
  static async getAll() {
    try {
      const { data } = await ItemSectionApi.getAll()
      const response = itemSectionsDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.itemSections
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static async getById(id: ItemSection['id']) {
    try {
      const { data } = await ItemSectionApi.getById(id)
      const response = itemSectionDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.itemSection
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static async update(formData: ItemSectionEditFormData) {
    try {
      const { data } = await ItemSectionApi.update(formData)
      const response = messageResponseSchema.safeParse(data)
      if (response.success) {
        return response.data
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }
}
