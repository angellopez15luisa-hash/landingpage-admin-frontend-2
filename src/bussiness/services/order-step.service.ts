import type { OrderStep, OrderStepEditFormData } from '@/types/order-step.type'
import { isAxiosError } from 'axios'
import { OrderStepApi } from '../apis'
import {
  orderStepDataResponseSchema,
  orderStepsDataResponseSchema,
} from '@/schemas/order-step.schema'
import type { MessageResponse } from '@/types/custom.type'
import { messageResponseSchema } from '@/schemas/custom.schema'

export class OrderStepService {
  static getAll = async (): Promise<OrderStep[] | undefined> => {
    try {
      const { data } = await OrderStepApi.getAll()
      const response = orderStepsDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.orderSteps
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static getById = async (id: OrderStep['id']): Promise<OrderStep | undefined> => {
    try {
      const { data } = await OrderStepApi.getById(id)
      const response = orderStepDataResponseSchema.safeParse(data)
      if (response.success) {
        return response.data.orderStep
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }

  static update = async (formData: OrderStepEditFormData): Promise<MessageResponse | undefined> => {
    try {
      const { data } = await OrderStepApi.update(formData)
      const response = messageResponseSchema.safeParse(data)
      if (response.success) {
        return response.data
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      }
    }
  }
}
