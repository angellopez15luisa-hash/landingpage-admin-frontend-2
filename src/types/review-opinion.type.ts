import type {
  reviewOpinionCreateSchema,
  reviewOpinionDataResponseSchema,
  reviewOpinionResponseSchema,
  reviewOpinionSchema,
  reviewOpinionsDataResponseSchema,
  reviewOpinionsResponseSchema,
  reviewOpinionUpdateSchema,
} from '@/schemas/review-opinion.schema'
import z from 'zod'

export type ReviewOpinion = z.infer<typeof reviewOpinionSchema>

export type ReviewOpinionCreateForm = z.infer<typeof reviewOpinionCreateSchema>

export type ReviewOpinionEditForm = z.infer<typeof reviewOpinionUpdateSchema>

export type ReviewOpinionEditFormData = {
  id: ReviewOpinion['id']
  data: ReviewOpinionEditForm
}

export type ReviewOpinionResponse = z.infer<typeof reviewOpinionResponseSchema>

export type ReviewOpinionsResponse = z.infer<typeof reviewOpinionsResponseSchema>

export type ReviewOpinionDataResponse = z.infer<typeof reviewOpinionDataResponseSchema>

export type ReviewOpinionsDataResponse = z.infer<typeof reviewOpinionsDataResponseSchema>
