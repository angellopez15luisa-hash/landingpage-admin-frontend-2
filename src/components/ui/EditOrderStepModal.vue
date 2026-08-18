<script setup lang="ts">
import type { OrderStep, OrderStepEditForm } from '@/types/order-step.type'
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { OrderStepAction } from '@/bussiness/actions/order-step.action'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { orderStepSchema } from '@/schemas/order-step.schema'
import { toast } from 'vue3-toastify'
import { OrderStepValue } from '@/values/order-step.value'

const props = defineProps<{
  isOpen: boolean
  id: OrderStep['id']
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const numberInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

const { data: orderStep } = useQuery({
  queryKey: ['order-step', props.id],
  queryFn: () => OrderStepAction.getById(props.id),
  retry: false,
  enabled: () => !!props.id && props.isOpen,
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm<OrderStepEditForm>({
  initialValues: OrderStepValue.editForm,
  validationSchema: toTypedSchema(orderStepSchema),
})

const [number, numberAttrs] = defineField('number')
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')

const { mutate, isPending } = useMutation({
  mutationFn: OrderStepAction.update,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Actualizado correctamente')
    queryClient.invalidateQueries({ queryKey: ['order-steps'] })
    resetForm()
    emit('close')
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error')
  },
})

// Sincronizamos los datos y forzamos el foco cuando se abre el modal
watch(
  () => props.isOpen,
  async (newIsOpen) => {
    if (newIsOpen) {
      await nextTick()
      modalRef.value?.focus()
      numberInputRef.value?.focus()
    }
  },
)

watch(
  orderStep,
  (values) => {
    if (values) {
      resetForm({ values }, { force: true })
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

const handleClose = () => {
  resetForm()
  emit('close')
}

// 🔹 Función onSubmit gestionada por VeeValidate
const onSubmit = handleSubmit((values) => {
  mutate({ id: props.id, data: values })
})

const disabled = computed<boolean>(() => isPending.value || !meta.value.valid)
</script>

<template>
  <!-- 🔹 Contenedor principal del modal -->
  <div
    v-if="isOpen"
    ref="modalRef"
    @keydown.esc.stop="handleClose"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 outline-none"
  >
    <!-- 🔹 Convertido en <form> y conectado a VeeValidate -->
    <form
      @submit.prevent="onSubmit"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-xl overflow-hidden transition-all"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800"
      >
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Editar Paso</h3>
        <button
          type="button"
          @click="handleClose"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Body / Campos del Formulario -->
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Number -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Número (number)</label
          >
          <input
            ref="numberInputRef"
            type="text"
            v-model="number"
            v-bind="numberAttrs"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.number" class="text-red-500 text-xs mt-1 block">{{ errors.number }}</span>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Título (title)</label
          >
          <input
            type="text"
            v-model="title"
            v-bind="titleAttrs"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.title" class="text-red-500 text-xs mt-1 block">{{
            errors.title
          }}</span>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Descripción (description)</label
          >
          <textarea
            v-model="description"
            v-bind="descriptionAttrs"
            rows="3"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          ></textarea>
          <span v-if="errors.description" class="text-red-500 text-xs mt-1 block">{{
            errors.description
          }}</span>
        </div>
      </div>

      <!-- Footer / Acciones -->
      <div
        class="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800"
      >
        <!-- Botón Cancelar -->
        <button
          type="button"
          @click="handleClose"
          class="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer shadow-xs"
        >
          <svg
            class="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Cancelar</span>
        </button>

        <!-- Botón de acción principal -->
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="disabled"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
            ></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>{{ isPending ? 'Guardando...' : 'Guardar Cambios' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
