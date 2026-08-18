import type {
  CatalogCategory,
  CatalogCategoryCreateForm,
  CatalogCategoryEditFormData,
} from '@/types/catalog-category.type'
import { CatalogCategoryService } from '../services'

export class CatalogCategoryAction {
  static getAll = () => CatalogCategoryService.getAll()

  static getById = (id: CatalogCategory['id']) => CatalogCategoryService.getById(id)

  static create = (formData: CatalogCategoryCreateForm) => CatalogCategoryService.create(formData)

  static update = (formData: CatalogCategoryEditFormData) => CatalogCategoryService.update(formData)

  static remove = (id: CatalogCategory['id']) => CatalogCategoryService.delete(id)
}
