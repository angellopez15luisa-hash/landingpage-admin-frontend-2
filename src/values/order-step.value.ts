import type { OrderStepEditForm } from '@/types/order-step.type'

export class OrderStepValue {
  static editForm: OrderStepEditForm = {
    number: '',
    title: '',
    description: '',
  }
}
