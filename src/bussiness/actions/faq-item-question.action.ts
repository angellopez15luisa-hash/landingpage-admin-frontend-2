import type {
  FaqItemQuestion,
  FaqItemQuestionCreateForm,
  FaqItemQuestionUpdateFormData,
} from '@/types/faq-item-question.type'
import { FaqItemQuestionService } from '../services'

export class FaqItemQuestionAction {
  static getAll = () => FaqItemQuestionService.getAll()

  static getById = (id: FaqItemQuestion['id']) => FaqItemQuestionService.getById(id)

  static create = (formData: FaqItemQuestionCreateForm) => FaqItemQuestionService.create(formData)

  static update = (formData: FaqItemQuestionUpdateFormData) =>
    FaqItemQuestionService.update(formData)

  static delete = (id: FaqItemQuestion['id']) => FaqItemQuestionService.delete(id)
}
