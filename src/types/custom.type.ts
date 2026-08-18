import type { messageResponseSchema } from '@/schemas/custom.schema'
import z from 'zod'

export type MessageResponse = z.infer<typeof messageResponseSchema>
