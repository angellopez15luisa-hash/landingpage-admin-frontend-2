import type { ReviewOpinionCreateForm, ReviewOpinionEditForm } from '@/types/review-opinion.type'

export class ReviewOpinionValue {
  static createForm: ReviewOpinionCreateForm = {
    name: '',
    rating: 0,
    text: '',
  }

  static editForm: ReviewOpinionEditForm = {
    name: '',
    rating: 0,
    text: '',
    isActive: false
  }
}
