import type {
  CatalogItem,
  // CatalogItemCreateForm,
  CatalogItemEditFormData,
} from '@/types/catalog-item.type'
import { CatalogItemService } from '../services/catalog-item.service'

export class CatalogItemAction {
  static getAll = () => CatalogItemService.getAll()

  static getById = (id: CatalogItem['id']) => CatalogItemService.getById(id)

  static create = (formData: FormData) => CatalogItemService.create(formData)

  static update = (formData: CatalogItemEditFormData) => CatalogItemService.update(formData)

  static remove = (id: CatalogItem['id']) => CatalogItemService.delete(id)
}
