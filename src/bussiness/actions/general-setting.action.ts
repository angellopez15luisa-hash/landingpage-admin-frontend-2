import type { GeneralSettingEditFormData } from '@/types/general-setting.type'
import { GeneralSettingService } from '../services'

export class GeneralSettingAction {
  
  static get = () => GeneralSettingService.get()

  static update = (formData: GeneralSettingEditFormData) => GeneralSettingService.update(formData)
}
