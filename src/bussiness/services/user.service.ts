import type {
  User,
  UserForgotPasswordForm,
  UserGetProfileResponse,
  UserResetPasswordFormData,
  UserSignInForm,
  UserSignInResponseData,
  UserUpdatePasswordFormData,
} from '@/types/user.type'
import { isAxiosError } from 'axios'
import { UserApi } from '../apis'
import {
  userGetProfileResponseDataSchema,
  userSignInResponseDataSchema,
} from '@/schemas/user.schema'
import type { MessageResponse } from '@/types/custom.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class UserService {
  static signIn = async (formData: UserSignInForm): Promise<UserSignInResponseData> => {
    try {
      const { data } = await UserApi.signIn(formData)
      const response = userSignInResponseDataSchema.safeParse(data)
      if (!response.success) {
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      }
      localStorage.setItem('TOKEN_LANDINGPAGE', response.data.token)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
  static getProfile = async (): Promise<UserGetProfileResponse> => {
    try {
      const { data } = await UserApi.getProfile()
      const response = userGetProfileResponseDataSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data.user
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static updatePassword = async (
    formData: UserUpdatePasswordFormData,
  ): Promise<MessageResponse> => {
    try {
      const { data } = await UserApi.updatePassword(formData)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static forgotPassword = async (formData: UserForgotPasswordForm): Promise<MessageResponse> => {
    try {
      const { data } = await UserApi.forgotPassword(formData)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
  static verifyResetToken = async (token: User['token']): Promise<MessageResponse> => {
    try {
      const { data } = await UserApi.verifyResetToken(token)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static resetPassword = async (formData: UserResetPasswordFormData): Promise<MessageResponse> => {
    try {
      const { data } = await UserApi.resetPassword(formData)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
}
