import type {
  ReviewOpinion,
  ReviewOpinionCreateForm,
  ReviewOpinionEditFormData,
} from '@/types/review-opinion.type'
import { ReviewOpinionService } from '../services'

export class ReviewOpinionAction {
  static getAll = () => ReviewOpinionService.getAll()

  static getById = (id: ReviewOpinion['id']) => ReviewOpinionService.getById(id)

  static create = (formData: ReviewOpinionCreateForm) => ReviewOpinionService.create(formData)

  static update = (formData: ReviewOpinionEditFormData) => ReviewOpinionService.update(formData)

  static delete = (id: ReviewOpinion['id']) => ReviewOpinionService.delete(id)
}
