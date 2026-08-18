import type { HeroSection, HeroSectionEditFormData } from '@/types/hero-section.type'
import { HeroSectionService } from '../services'

export class HeroSectionAction {
  static getAll = () => HeroSectionService.getAll()

  static getById = (id: HeroSection['id']) => {
    return HeroSectionService.getById(id)
  }

  static update = (formData: HeroSectionEditFormData) => {
    return HeroSectionService.update(formData)
  }
}
