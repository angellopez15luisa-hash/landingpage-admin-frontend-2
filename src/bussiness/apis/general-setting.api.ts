import api from '@/lib/axios'
import type {
  GeneralSettingDataResponse,
  GeneralSettingEditFormData,
} from '@/types/general-setting.type'

export class GeneralSettingApi {
  static get = () => api.get<GeneralSettingDataResponse>(`/general-settings`)

  static update = (formData: GeneralSettingEditFormData) =>
    api.patch(`/general-settings/${formData.id}`, formData.data)
}
