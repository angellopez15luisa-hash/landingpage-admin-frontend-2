import type {
  orderStepDataResponseSchema,
  orderStepSchema,
  orderStepsDataResponseSchema,
} from '@/schemas/order-step.schema'
import z from 'zod'

export type OrderStep = z.infer<typeof orderStepSchema>

export type OrderStepEditForm = Pick<OrderStep, 'number' | 'title' | 'description'>

export type OrderStepEditFormData = {
  id: OrderStep['id']
  data: OrderStepEditForm
}

export type OrderStepDataResponse = z.infer<typeof orderStepDataResponseSchema>

export type OrderStepsDataResponse = z.infer<typeof orderStepsDataResponseSchema>
