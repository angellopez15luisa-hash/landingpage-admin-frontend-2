import api from '@/lib/axios'
import type {
  CatalogItemsDataResponse,
  CatalogItem,
  // CatalogItemCreateForm,
  CatalogItemDataResponse,
  CatalogItemEditFormData,
} from '@/types/catalog-item.type.ts'
import type { MessageResponse } from '@/types/custom.type'

export class CatalogItemApi {
  static getAll = () => api.get<CatalogItemsDataResponse>('/catalog-items')

  static getById = (id: CatalogItem['id']) =>
    api.get<CatalogItemDataResponse>(`/catalog-items/${id}`)

  static create = (formData: FormData) =>
    api.post<MessageResponse>('/catalog-items', formData)

  static update = (formData: CatalogItemEditFormData) =>
    api.patch<MessageResponse>(`/catalog-items/${formData.id}`, formData.data)

  static delete = (id: CatalogItem['id']) =>
    api.delete<MessageResponse>(`/catalog-items/${id}`)
}
