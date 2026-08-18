<script setup lang="ts">
import { GeneralSettingAction } from '@/bussiness/actions'
import { generalSettingSchema } from '@/schemas/general-setting.schema'
import { GeneralSettingValue } from '@/values'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, nextTick, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

// Estado para controlar si la edición está habilitada o bloqueada
const isEditing = ref(false)
const textTitleInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

// Nota: Ya no necesitas declarar la variable local 'form' aquí porque
// VeeValidate y useQuery se encargan de sincronizar los datos mediante el resetForm.

const { data: generalSetting } = useQuery({
  queryKey: ['catalog-item'],
  queryFn: () => GeneralSettingAction.get(),
  retry: false,
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: GeneralSettingValue.editForm,
  validationSchema: toTypedSchema(generalSettingSchema),
})

const [textTitleCatalogItem, textTitleCatalogItemAttrs] = defineField('textTitleCatalogItem')
const [textSubtitleCatalogItem, textSubtitleCatalogItemAttrs] = defineField('textSubtitleCatalogItem')

const { mutate, isPending } = useMutation({
  mutationFn: GeneralSettingAction.update,
  onSuccess: async (data) => {
    queryClient.invalidateQueries({ queryKey: ['catalog-item'] })
    isEditing.value = false
    toast.success(data?.message || 'Actualizado correctamente')
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error')
  },
})

// Función para disparar la mutación al enviar el formulario
const onSubmit = handleSubmit((values) => {
  // Asegúrate de enviar la estructura con el ID (por ejemplo, id: 1) y los valores modificados
  mutate({
    id: values.id,
    data: values,
  })
})

watch(
  [() => generalSetting.value, () => isEditing.value],
  ([valueGeneralSetting], [valueIsEditing]) => {
    if (valueGeneralSetting || valueIsEditing) {
      resetForm({ values: valueGeneralSetting }, { force: true })
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => isEditing.value,
  async (value) => {
    if (value) {
      await nextTick()
      textTitleInputRef.value?.focus()
    }
  },
)

// Función para alternar el modo edición
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    nextTick(() => {
      const input = textTitleInputRef.value
      if (input) {
        input.focus()
        const length = input.value.length
        input.setSelectionRange(length, length)
      }
    })
  }
}

const disabled = computed<boolean>(() => !isEditing.value || isPending.value || !meta.value.valid)
</script>

<template>
  <div
    class="bg-white dark:bg-[#121826] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-gray-900 dark:text-white shadow-xl transition-colors duration-200"
  >
    <!-- Cabecera de la tarjeta con el botón de Habilitar Edición -->
    <div class="flex justify-between items-start mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
         Textos de la Sección del Catálogo
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
         Personaliza el título y subtítulo principal que aparecen en esta sección del catálogo.
        </p>
      </div>

      <button
        type="button"
        @click="toggleEdit"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200"
        :class="
          isEditing
            ? 'bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500/20'
            : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        {{ isEditing ? 'Bloquear Edición' : 'Habilitar Edición' }}
      </button>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Campo 1: Título -->
      <div>
        <label
          class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider"
        >
         TÍTULO (EJ. CATÁLOGO EXCLUSIVO)
        </label>
        <input
          ref="textTitleInputRef"
          v-model="textTitleCatalogItem"
          v-bind="textTitleCatalogItemAttrs"
          type="text"
          :disabled="!isEditing"
          class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
          :class="
            !isEditing
              ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
          "
        />
        <span v-if="errors.textTitleCatalogItem" class="text-red-500 text-xs mt-1 block">
          {{ errors.textTitleCatalogItem }}
        </span>
      </div>

      <!-- Campo 2: Subtítulo -->
      <div>
        <label
          class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider"
        >
         SUBTÍTULO DE LA SECCIÓN
        </label>
        <input
          v-model="textSubtitleCatalogItem"
          v-bind="textSubtitleCatalogItemAttrs"
          type="text"
          :disabled="!isEditing"
          class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
          :class="
            !isEditing
              ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
          "
        />
        <span v-if="errors.textSubtitleCatalogItem" class="text-red-500 text-xs mt-1 block">
          {{ errors.textSubtitleCatalogItem }}
        </span>
      </div>

      <!-- Botón Guardar Cambios -->
      <div class="pt-2 flex justify-start">
        <button
          type="submit"
          :disabled
          class="font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
          :class="
            disabled
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {{ isPending ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>
