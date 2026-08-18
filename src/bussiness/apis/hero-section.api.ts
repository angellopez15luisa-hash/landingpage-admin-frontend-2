import api from '@/lib/axios'
import type {
  HeroSection,
  HeroSectionDataResponse,
  HeroSectionEditFormData,
  HeroSectionsDataResponse,
} from '@/types/hero-section.type'

export class HeroSectionApi {
  static getAll = () => api.get<HeroSectionsDataResponse>(`/hero-sections`)

  static getById = (id: HeroSection['id']) =>
    api.get<HeroSectionDataResponse>(`/hero-sections/${id}`)

  static update = (formData: HeroSectionEditFormData) =>
    api.patch(`/hero-sections/${formData.id}`, formData.data)
}
