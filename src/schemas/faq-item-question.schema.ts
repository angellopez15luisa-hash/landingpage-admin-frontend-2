import { z } from 'zod'

export const faqItemQuestionSchema = z.object({
  id: z.number().optional(),
  question: z
    .string({ message: '* La pregunta debe ser una cadena de texto' })
    .min(3, '* La pregunta debe tener al menos tres caracteres'),
    // .optional(),
  answer: z
    .string({ message: '* La respuesta debe ser una cadena de texto' })
    .min(3, '* La respuesta debe tener al menos tres caracteres'),
    // .optional(),
  isActive: z.boolean(),
})

export const faqItemQuestionCreateSchema = faqItemQuestionSchema.pick({
  question: true,
  answer: true,
})

export const faqItemQuestionUpdateSchema = faqItemQuestionSchema.pick({
  question: true,
  answer: true,
  isActive: true,
})

export const faqItemQuestionResponseSchema = faqItemQuestionSchema.pick({
  id: true,
  question: true,
  answer: true,
  isActive: true,
})

export const faqItemQuestionsResponseSchema = z.array(faqItemQuestionResponseSchema)

export const faqItemQuestionDataResponseSchema = z.object({
  faqItemQuestion: faqItemQuestionResponseSchema,
  success: z.boolean(),
})

export const faqItemQuestionsDataResponseSchema = z.object({
  faqItemQuestions: faqItemQuestionsResponseSchema,
  success: z.boolean(),
})
