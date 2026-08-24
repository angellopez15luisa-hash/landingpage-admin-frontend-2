import { isAxiosError } from 'axios'
import { ReviewOpinionApi } from '../apis'
import {
  reviewOpinionDataResponseSchema,
  reviewOpinionsDataResponseSchema,
} from '@/schemas/review-opinion.schema'
import type {
  ReviewOpinion,
  ReviewOpinionCreateForm,
  ReviewOpinionEditFormData,
  ReviewOpinionResponse,
  ReviewOpinionsResponse,
} from '@/types/review-opinion.type'
import type { MessageResponse } from '@/types/custom.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class ReviewOpinionService {
  static getAll = async (): Promise<ReviewOpinionsResponse> => {
    try {
      const { data } = await ReviewOpinionApi.getAll()
      const response = reviewOpinionsDataResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data.reviewOpinions
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static getById = async (id: ReviewOpinion['id']): Promise<ReviewOpinionResponse> => {
    try {
      const { data } = await ReviewOpinionApi.getById(id)
      const response = reviewOpinionDataResponseSchema.safeParse(data)
      if (!response.success)
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      return response.data.reviewOpinion
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }

  static create = async (formData: ReviewOpinionCreateForm): Promise<MessageResponse> => {
    try {
      const { data } = await ReviewOpinionApi.create(formData)
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

  static update = async (formData: ReviewOpinionEditFormData): Promise<MessageResponse> => {
    try {
      const { data } = await ReviewOpinionApi.update(formData)
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

  static delete = async (id: ReviewOpinion['id']): Promise<MessageResponse> => {
    try {
      const { data } = await ReviewOpinionApi.delete(id)
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
