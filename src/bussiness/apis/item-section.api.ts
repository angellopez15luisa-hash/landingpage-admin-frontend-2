import api from '@/lib/axios'
import type { MessageResponse } from '@/types/custom.type'
import type {
  ItemSectionsDataResponse,
  ItemSection,
  ItemSectionDataResponse,
  ItemSectionEditFormData,
} from '@/types/item-section.type'

export class ItemSectionApi {
  static getAll() {
    return api.get<ItemSectionsDataResponse>(`/item-sections`)
  }

  static getById(id: ItemSection['id']) {
    return api.get<ItemSectionDataResponse>(`/item-sections/${id}`)
  }

  static update(formData: ItemSectionEditFormData) {
    return api.patch<MessageResponse>(`/item-sections/${formData.id}`, formData.data)
  }
}
