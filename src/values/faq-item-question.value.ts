import type {
  FaqItemQuestionCreateForm,
  FaqItemQuestionUpdateForm,
} from '@/types/faq-item-question.type'

export class FaqItemQuestionValue {
  static createForm: FaqItemQuestionCreateForm = {
    question: '',
    answer: '',
  }

  static updateForm: FaqItemQuestionUpdateForm = {
    question: '',
    answer: '',
    isActive: false,
  }
}
