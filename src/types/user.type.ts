import type {
  userGetProfileResponseDataSchema,
  userGetProfileResponseSchema,
  userResetPasswordSchema,
  userSchema,
  userSignInResponseDataSchema,
  userUpdatePasswordSchema,
} from '@/schemas/user.schema'
import z from 'zod'

export type User = z.infer<typeof userSchema>

export type UserSignInForm = Pick<User, 'email' | 'password'>

export type UserUpdatePasswordFormData = Pick<User, 'currentPassword' | 'newPassword'>

export type UserUpdatePasswordForm = z.infer<typeof userUpdatePasswordSchema>

export type UserForgotPasswordForm = Pick<User, 'email'|'frontendUrl'>

export type UserProfile = z.infer<typeof userGetProfileResponseSchema>

export type UserSignInResponseData = z.infer<typeof userSignInResponseDataSchema>

export type UserGetProfileResponseData = z.infer<typeof userGetProfileResponseDataSchema>

export type UserGetProfileResponse = z.infer<typeof userGetProfileResponseSchema>

export type UserResetPasswordForm = z.infer<typeof userResetPasswordSchema>

export type UserResetPasswordFormData = {
  token: User['token']
  data: Pick<User, 'newPassword'>
}

// export type UserVerifyResetTokenParams = z.infer<typeof userVerifyResetTokenSchema>

// export type UserUpdatePassword = z.infer<typeof userUpdatePasswordSchema>
