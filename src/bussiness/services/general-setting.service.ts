import type { GeneralSetting, GeneralSettingEditFormData } from '@/types/general-setting.type'
import { isAxiosError } from 'axios'
import { GeneralSettingApi } from '../apis'
import { generalSettingDataResponseSchema } from '@/schemas/general-setting.schema'
import type { MessageResponse } from '@/types/custom.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class GeneralSettingService {
  static get = async (): Promise<GeneralSetting | undefined> => {
    try {
      const { data } = await GeneralSettingApi.get()
      const response = generalSettingDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.generalSetting
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static update = async (
    formData: GeneralSettingEditFormData,
  ): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await GeneralSettingApi.update(formData)
      const response = messageResponseSchema.safeParse(data)
      if (response.success) {
        return response.data
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }
}
