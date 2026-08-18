import type {
  UserForgotPasswordForm,
  UserProfile,
  UserResetPasswordForm,
  UserSignInForm,
  UserUpdatePasswordForm,
} from '@/types/user.type'

export class UserValue {
  static signInForm: UserSignInForm = {
    email: '',
    password: '',
  }
  static userProfile: UserProfile = {
    id: 0,
    email: '',
    role: '',
    isActive: false,
  }
  static updatePassword: UserUpdatePasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  static forgotPassword: UserForgotPasswordForm = {
    email: '',
  }

  static resetPasswordForm: UserResetPasswordForm = {
    newPassword: '',
    confirmPassword:''
  }
}
