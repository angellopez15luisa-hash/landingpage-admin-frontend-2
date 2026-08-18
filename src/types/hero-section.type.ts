import type {
  heroSectionDataResponseSchema,
  heroSectionSchema,
  heroSectionsDataResponseSchema,
} from '@/schemas/hero-section.schema'
import z from 'zod'

export type HeroSection = z.infer<typeof heroSectionSchema>

export type HeroSectionEditForm = Pick<
  HeroSection,
  'imagePath' | 'tag' | 'title' | 'highlightText' | 'description'
>

export type HeroSectionEditFormData = {
  id: HeroSection['id']
  data:FormData
}

export type HeroSectionDataResponse = z.infer<typeof heroSectionDataResponseSchema>

export type HeroSectionsDataResponse = z.infer<typeof heroSectionsDataResponseSchema>
