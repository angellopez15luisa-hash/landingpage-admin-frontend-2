import type {
  User,
  UserForgotPasswordForm,
  UserResetPasswordFormData,
  UserSignInForm,
  UserUpdatePasswordFormData,
} from '@/types/user.type'
import { UserService } from '../services'

export class UserAction {
  static signIn = (formData: UserSignInForm) => UserService.signIn(formData)

  static getProfile = () => UserService.getProfile()

  static updatePassword = (formData: UserUpdatePasswordFormData) =>
    UserService.updatePassword(formData)

  static forgotPassword = (formData: UserForgotPasswordForm) => UserService.forgotPassword(formData)

  static verifyResetToken = (token: User['token']) => UserService.verifyResetToken(token)

  static resetPassword = (formData: UserResetPasswordFormData) =>
    UserService.resetPassword(formData)
}
