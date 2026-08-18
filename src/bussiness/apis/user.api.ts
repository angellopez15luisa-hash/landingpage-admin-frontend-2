import api from '@/lib/axios'
import type { MessageResponse } from '@/types/custom.type'
import type {
  User,
  UserForgotPasswordForm,
  UserGetProfileResponseData,
  UserResetPasswordFormData,
  UserSignInForm,
  UserSignInResponseData,
  UserUpdatePasswordFormData,
} from '@/types/user.type'

export class UserApi {
  static signIn = (formData: UserSignInForm) =>
    api.post<UserSignInResponseData>(`/users/sign-in`, formData)

  static getProfile = () => api.get<UserGetProfileResponseData>(`/users/profile`)

  static updatePassword = (formData: UserUpdatePasswordFormData) =>
    api.patch<MessageResponse>(`/users/update-password`, formData)

  static forgotPassword = (formData: UserForgotPasswordForm) =>
    api.post<MessageResponse>(`/users/forgot-password`, formData)

  static verifyResetToken = (token: User['token']) =>
    api.get<MessageResponse>(`/users/verify-reset-token/${token}`)

  static resetPassword = (formData: UserResetPasswordFormData) =>
    api.post<MessageResponse>(`/users/reset-password/${formData.token}`, formData.data)
}
