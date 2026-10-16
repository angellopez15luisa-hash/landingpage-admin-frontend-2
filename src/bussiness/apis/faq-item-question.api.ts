import api from '@/lib/axios'
import type { MessageResponse } from '@/types/custom.type'
import type {
  FaqItemQuestion,
  FaqItemQuestionCreateForm,
  FaqItemQuestionDataResponse,
  FaqItemQuestionsDataResponse,
  FaqItemQuestionUpdateFormData,
} from '@/types/faq-item-question.type'

export class FaqItemQuestionApi {
  static getAll = () => api.get<FaqItemQuestionsDataResponse>('/faq-item-questions')

  static getById = (id: FaqItemQuestion['id']) =>
    api.get<FaqItemQuestionDataResponse>(`/faq-item-questions/${id}`)

  static create = (formData: FaqItemQuestionCreateForm) =>
    api.post<MessageResponse>(`/faq-item-questions`, formData)

  static update = (formData: FaqItemQuestionUpdateFormData) =>
    api.patch<MessageResponse>(`/faq-item-questions/${formData.id}`, formData.data)

  static delete = (id: FaqItemQuestion['id']) =>
    api.delete<MessageResponse>(`/faq-item-questions/${id}`)
}
