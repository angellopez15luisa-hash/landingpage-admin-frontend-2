import z from 'zod'

export const generalSettingSchema = z.object({
  id: z.number(),
  textNameCompany: z
    .string({ message: '* El text-name-company debe ser una cadena de texto' })
    .min(3, {
      message: '* El text-name-company debe tener al menos tres caracteres',
    })
    .optional(),
  textButtonNavbar: z
    .string({ message: '* El text-button-navbar debe ser una cadena de texto' })
    .min(3, {
      message: '* El text-button-navbar debe tener al menos tres caracteres',
    })
    .optional(),
  textHrefNavbar: z
    .string({ message: '* El text-href-navbar debe ser una cadena de texto' })
    .min(3, {
      message: '* El text-href-navbar debe tener al menos tres caracteres',
    })
    .optional(),
  textButtonHeroSection: z
    .string({
      message: '* El text-button-hero-section debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-button-hero-section debe tener al menos tres caracteres',
    })
    .optional(),
  textTitleOrderStep: z
    .string({
      message: '* El text-title-order-step debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-title-order-step debe tener al menos tres caracteres',
    })
    .optional(),
  textSubtitleOrderStep: z
    .string({
      message: '* El text-subtitle-order-step debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-subtitle-order-step debe tener al menos tres caracteres',
    })
    .optional(),
  textTitleCatalogItem: z
    .string({
      message: '* El text-title-catalog-item debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-title-catalog-item debe tener al menos tres caracteres',
    })
    .optional(),
  textSubtitleCatalogItem: z
    .string({
      message: '* El text-subtitle-catalog-item debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-subtitle-catalog-item debe tener al menos tres caracteres',
    })
    .optional(),
  textTitleReviewOpinion: z
    .string({
      message: '* El text-title-review-opinion debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-title-review-opinion debe tener al menos tres caracteres',
    })
    .optional(),
  textSubtitleReviewOpinion: z
    .string({
      message: '* El text-subtitle-review-opinion debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-subtitle-review-opinion debe tener al menos tres caracteres',
    })
    .optional(),
  textTitleFaqItemQuestion: z
    .string({
      message: '* El text-title-faq-item-question debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-title-faq-item-question debe tener al menos tres caracteres',
    })
    .optional(),
  textSubtitleFaqItemQuestion: z
    .string({
      message: '* El text-subtitle-faq-item-qestion debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-subtitle-faq-item-qestion debe tener al menos tres caracteres',
    })
    .optional(),
  textPhoneFooterSection: z
    .string({
      message: '* El text-phone-footer-section debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-phone-footer-section debe tener al menos tres caracteres',
    })
    .optional(),
  textEmailFooterSection: z
    .string({
      message: '* El text-email-footer-section debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-email-footer-section debe tener al menos tres caracteres',
    })
    .optional(),
  textAddressFooterSection: z
    .string({
      message: '* El text-address-footer-section debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-address-footer-section debe tener al menos tres caracteres',
    })
    .optional(),
  textBusinessHoursFooterSection: z
    .string({
      message: '* El text-business-hours-footer-section debe ser una cadena de texto',
    })
    .min(3, {
      message: '* El text-business-hours-footer-section debe tener al menos tres caracteres',
    })
    .optional(),
})

export const generalSettingResponseSchema = generalSettingSchema.pick({
  id: true,
  textNameCompany: true,
  textButtonNavbar: true,
  textHrefNavbar: true,
  textButtonHeroSection: true,
  textTitleOrderStep: true,
  textSubtitleOrderStep: true,
  textTitleCatalogItem: true,
  textSubtitleCatalogItem: true,
  textTitleReviewOpinion: true,
  textSubtitleReviewOpinion: true,
  textTitleFaqItemQuestion: true,
  textSubtitleFaqItemQuestion: true,
  textPhoneFooterSection: true,
  textEmailFooterSection: true,
  textAddressFooterSection: true,
  textBusinessHoursFooterSection: true,
})

export const generalSettingDataResponseSchema = z.object({
  generalSetting: generalSettingResponseSchema,
  success: z.boolean(),
})
