import type { ItemSection, ItemSectionEditFormData } from '@/types/item-section.type'
import { ItemSectionService } from '../services'

export class ItemSectionAction {
  static getAll() {
    return ItemSectionService.getAll()
  }

  static getById(id: ItemSection['id']) {
    return ItemSectionService.getById(id)
  }

  static update(formData: ItemSectionEditFormData) {
    return ItemSectionService.update(formData)
  }
}
