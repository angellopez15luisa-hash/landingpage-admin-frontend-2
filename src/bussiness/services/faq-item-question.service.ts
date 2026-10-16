import type {
  FaqItemQuestion,
  FaqItemQuestionCreateForm,
  FaqItemQuestionResponse,
  FaqItemQuestionsResponse,
  FaqItemQuestionUpdateFormData,
} from '@/types/faq-item-question.type'
import { isAxiosError } from 'axios'
import { FaqItemQuestionApi } from '../apis'
import {
  faqItemQuestionDataResponseSchema,
  faqItemQuestionsDataResponseSchema,
} from '@/schemas/faq-item-question.schema'
import type { MessageResponse } from '@/types/custom.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class FaqItemQuestionService {
  static getAll = async (): Promise<FaqItemQuestionsResponse> => {
    try {
      const { data } = await FaqItemQuestionApi.getAll()
      const response = faqItemQuestionsDataResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data.faqItemQuestions
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static getById = async (id: FaqItemQuestion['id']): Promise<FaqItemQuestionResponse> => {
    try {
      const { data } = await FaqItemQuestionApi.getById(id)
      const response = faqItemQuestionDataResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data.faqItemQuestion
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static create = async (formData: FaqItemQuestionCreateForm): Promise<MessageResponse> => {
    try {
      const { data } = await FaqItemQuestionApi.create(formData)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static update = async (formData: FaqItemQuestionUpdateFormData): Promise<MessageResponse> => {
    try {
      const { data } = await FaqItemQuestionApi.update(formData)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static delete = async (id: FaqItemQuestion['id']): Promise<MessageResponse> => {
    try {
      const { data } = await FaqItemQuestionApi.delete(id)
      const response = messageResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
}
