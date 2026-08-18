import type { OrderStep, OrderStepEditFormData } from '@/types/order-step.type'
import { OrderStepService } from '../services'

export class OrderStepAction {
  static getAll = () => OrderStepService.getAll()

  static getById = (id: OrderStep['id']) => OrderStepService.getById(id)

  static update = (formData: OrderStepEditFormData) => OrderStepService.update(formData)
}
