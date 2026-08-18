import { isAxiosError } from 'axios'
import { CatalogCategoryApi } from '../apis/catalog-category.api'
import {
  catalogCategoryDataResponseSchema,
  catalogCategoriesDataResponseSchema,
} from '@/schemas/catalog-category.schema'
import type {
  CatalogCategory,
  CatalogCategoryCreateForm,
  CatalogCategoryEditFormData,
} from '@/types/catalog-category.type'
import { messageResponseSchema } from '@/schemas/custom.schema'
import type { MessageResponse } from '@/types/custom.type'

export class CatalogCategoryService {
  static getAll = async () => {
    try {
      const { data } = await CatalogCategoryApi.getAll()
      const response = catalogCategoriesDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.catalogCategories
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static getById = async (id: CatalogCategory['id']) => {
    try {
      const { data } = await CatalogCategoryApi.getById(id)
      const response = catalogCategoryDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.catalogCategory
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static create = async (
    formData: CatalogCategoryCreateForm,
  ): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await CatalogCategoryApi.create(formData)
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

  static update = async (formData: CatalogCategoryEditFormData) => {
    try {
      const { data } = await CatalogCategoryApi.update(formData)
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

  static delete = async (id: CatalogCategory['id']): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await CatalogCategoryApi.delete(id)
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
