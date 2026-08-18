import api from '@/lib/axios'
import type {
  CatalogCategoriesDataResponse,
  CatalogCategory,
  CatalogCategoryCreateForm,
  CatalogCategoryDataResponse,
  CatalogCategoryEditFormData,
} from '@/types/catalog-category.type'
import type { MessageResponse } from '@/types/custom.type'

export class CatalogCategoryApi {
  static getAll = () => api.get<CatalogCategoriesDataResponse>(`/catalog-categories`)

  static getById = (id: CatalogCategory['id']) =>
    api.get<CatalogCategoryDataResponse>(`/catalog-categories/${id}`)

  static create = (formData: CatalogCategoryCreateForm) =>
    api.post<MessageResponse>(`/catalog-categories`, formData)

  static update = (formData: CatalogCategoryEditFormData) =>
    api.patch<MessageResponse>(`/catalog-categories/${formData.id}`, formData.data)

  static delete = (id: CatalogCategory['id']) =>
    api.delete<MessageResponse>(`/catalog-categories/${id}`)
}
