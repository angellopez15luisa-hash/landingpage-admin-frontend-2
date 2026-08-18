import { isAxiosError } from 'axios'
import { NavbarApi } from '../apis'
import { navbarDataResponseSchema } from '@/schemas/navbar.schema'
import type { NavbarEditFormData } from '@/types/navbar.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class NavbarService {
  static async get() {
    try {
      const { data } = await NavbarApi.get()
      const response = navbarDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.navbar
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static async update(formData:NavbarEditFormData) {
    try {
      const { data } = await NavbarApi.update(formData)
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
