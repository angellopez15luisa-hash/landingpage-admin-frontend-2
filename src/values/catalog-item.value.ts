import type { CatalogItemCreateForm, CatalogItemEditForm } from '@/types/catalog-item.type'

export class CatalogItemValue {
  static createForm: CatalogItemCreateForm = {
    title: '',
    catalogCategoryId: 0,
    price: '',
    imagePath: '',
    badge: '',
  }

  static editForm: CatalogItemEditForm = {
    title: '',
    catalogCategoryId: 0,
    price: '',
    imagePath: '',
    badge: '',
    isActive: false,
  }
}
