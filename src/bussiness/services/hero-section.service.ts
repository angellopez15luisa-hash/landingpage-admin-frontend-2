import { isAxiosError } from 'axios'
import { HeroSectionApi } from '../apis'
import {
  heroSectionDataResponseSchema,
  heroSectionsDataResponseSchema,
} from '@/schemas/hero-section.schema'
import type { HeroSection, HeroSectionEditFormData } from '@/types/hero-section.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class HeroSectionService {
  static getAll = async () => {
    try {
      const { data } = await HeroSectionApi.getAll()
      const response = heroSectionsDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.heroSections
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static getById = async (id: HeroSection['id']) => {
    try {
      const { data } = await HeroSectionApi.getById(id)
      const response = heroSectionDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.heroSection
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static update = async (formData: HeroSectionEditFormData) => {
    try {
      const { data } = await HeroSectionApi.update(formData)
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
