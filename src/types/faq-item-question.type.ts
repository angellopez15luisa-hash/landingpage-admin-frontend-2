import type {
  faqItemQuestionCreateSchema,
  faqItemQuestionDataResponseSchema,
  faqItemQuestionResponseSchema,
  faqItemQuestionSchema,
  faqItemQuestionsDataResponseSchema,
  faqItemQuestionsResponseSchema,
  faqItemQuestionUpdateSchema,
} from '@/schemas/faq-item-question.schema'
import { z } from 'zod'

export type FaqItemQuestion = z.infer<typeof faqItemQuestionSchema>

export type FaqItemQuestionCreateForm = z.infer<typeof faqItemQuestionCreateSchema>

export type FaqItemQuestionUpdateForm = z.infer<typeof faqItemQuestionUpdateSchema>

export type FaqItemQuestionUpdateFormData = {
  id: FaqItemQuestion['id']
  data: FaqItemQuestionUpdateForm
}

export type FaqItemQuestionResponse = z.infer<typeof faqItemQuestionResponseSchema>

export type FaqItemQuestionsResponse = z.infer<typeof faqItemQuestionsResponseSchema>

export type FaqItemQuestionDataResponse = z.infer<typeof faqItemQuestionDataResponseSchema>

export type FaqItemQuestionsDataResponse = z.infer<typeof faqItemQuestionsDataResponseSchema>
