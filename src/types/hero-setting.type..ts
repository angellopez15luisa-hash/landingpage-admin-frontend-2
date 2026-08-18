import type {
  heroSettingDataResponseSchema,
  heroSettingSchema,
} from '@/schemas/hero-setting.schema'
import z from 'zod'

export type HeroSetting = z.infer<typeof heroSettingSchema>

export type HeroSettingEditForm = Pick<HeroSetting, 'buttonText'>

export type HeroSettingEditFormData = {
  id: HeroSetting['id']
  data: HeroSettingEditForm
}

export type HeroSettingDataResponse = z.infer<typeof heroSettingDataResponseSchema>
