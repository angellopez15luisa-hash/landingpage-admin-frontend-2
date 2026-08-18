import api from '@/lib/axios'
import type { MessageResponse } from '@/types/custom.type'
import type {
  OrderStep,
  OrderStepDataResponse,
  OrderStepEditFormData,
  OrderStepsDataResponse,
} from '@/types/order-step.type'

export class OrderStepApi {
  static getAll = () => api.get<OrderStepsDataResponse>(`/order-steps`)

  static getById = (id: OrderStep['id']) => api.get<OrderStepDataResponse>(`/order-steps/${id}`)

  static update = (formData: OrderStepEditFormData) =>
    api.patch<MessageResponse>(`/order-steps/${formData.id}`, formData.data)
}
