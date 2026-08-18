import api from '@/lib/axios'
import type { HeroSettingDataResponse, HeroSettingEditFormData } from '@/types/hero-setting.type.'

export class HeroSettingApi {
  static get = () => api.get<HeroSettingDataResponse>(`/hero-settings/get`)

  static update = (formData: HeroSettingEditFormData) =>
    api.patch(`/hero-settings/update/${formData.id}`, formData.data)
}
