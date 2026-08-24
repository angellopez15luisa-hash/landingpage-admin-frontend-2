import api from '@/lib/axios'
import type { MessageResponse } from '@/types/custom.type'
import type {
  ReviewOpinion,
  ReviewOpinionCreateForm,
  ReviewOpinionDataResponse,
  ReviewOpinionEditFormData,
  ReviewOpinionsDataResponse,
} from '@/types/review-opinion.type'

export class ReviewOpinionApi {
  static getAll = () => api.get<ReviewOpinionsDataResponse>('/review-opinions')

  static getById = (id: ReviewOpinion['id']) =>
    api.get<ReviewOpinionDataResponse>(`/review-opinions/${id}`)

  static create = (formData: ReviewOpinionCreateForm) =>
    api.post<MessageResponse>(`/review-opinions`, formData)

  static update = (formData: ReviewOpinionEditFormData) =>
    api.patch<MessageResponse>(`/review-opinions/${formData.id}`, formData.data)

  static delete = (id: ReviewOpinion['id']) => api.delete<MessageResponse>(`/review-opinions/${id}`)
}
