import type {
  generalSettingSchema,
  generalSettingResponseSchema,
} from '@/schemas/general-setting.schema'
import z from 'zod'

// 1. Tipo base inferido del esquema general
export type GeneralSetting = z.infer<typeof generalSettingSchema>

// 2. Tipo para el formulario de edición (todos los campos opcionales para el PATCH)
export type GeneralSettingEditForm = Partial<GeneralSetting>

// 3. Estructura de los datos que viajan al editar
export type GeneralSettingEditFormData = {
  id: GeneralSetting['id']
  data: GeneralSettingEditForm
}

// 4. Tipo para la respuesta del servidor
export type GeneralSettingDataResponse = z.infer<
  typeof generalSettingResponseSchema
>
