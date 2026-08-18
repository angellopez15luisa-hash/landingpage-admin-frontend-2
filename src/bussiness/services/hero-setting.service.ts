import type { HeroSetting, HeroSettingEditFormData } from '@/types/hero-setting.type.'
import { isAxiosError } from 'axios'
import { HeroSettingApi } from '../apis'
import { heroSettingDataResponseSchema } from '@/schemas/hero-setting.schema'
import type { MessageResponse } from '@/types/custom.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class HeroSettingService {
  static get = async (): Promise<HeroSetting | undefined> => {
    try {
      const { data } = await HeroSettingApi.get()
      const response = heroSettingDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.heroSetting
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static update = async (
    formData: HeroSettingEditFormData,
  ): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await HeroSettingApi.update(formData)
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
