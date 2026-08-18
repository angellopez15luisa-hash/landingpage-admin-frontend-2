import { isAxiosError } from 'axios'
import { CatalogItemApi } from '../apis'
import {
  catalogItemDataResponseSchema,
  catalogItemsDataResponseSchema,
} from '@/schemas/catalog-item.schema'
import type {
  CatalogItem,
  // CatalogItemCreateForm,
  CatalogItemEditFormData,
} from '@/types/catalog-item.type'
import { messageResponseSchema } from '@/schemas/custom.schema'
import type { MessageResponse } from '@/types/custom.type'

export class CatalogItemService {
  static getAll = async () => {
    try {
      const { data } = await CatalogItemApi.getAll()
      const response = catalogItemsDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.catalogItems
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static getById = async (id: CatalogItem['id']) => {
    try {
      const { data } = await CatalogItemApi.getById(id)
      const response = catalogItemDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.catalogItem
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static create = async (formData: FormData): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await CatalogItemApi.create(formData)
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

  static update = async (formData: CatalogItemEditFormData) => {
    try {
      const { data } = await CatalogItemApi.update(formData)
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

  static delete = async (id: CatalogItem['id']): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await CatalogItemApi.delete(id)
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
