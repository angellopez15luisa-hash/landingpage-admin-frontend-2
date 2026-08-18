import type { HeroSettingEditFormData } from '@/types/hero-setting.type.'
import { HeroSettingService } from '../services'

export class HeroSettingAction {
  static get = () => HeroSettingService.get()

  static update = (formData: HeroSettingEditFormData) => HeroSettingService.update(formData)
}
