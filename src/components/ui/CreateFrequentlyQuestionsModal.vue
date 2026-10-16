<script setup lang="ts">
import { FaqItemQuestionAction } from '@/bussiness/actions'
import { faqItemQuestionCreateSchema } from '@/schemas/faq-item-question.schema'
import { FaqItemQuestionValue } from '@/values'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { configure, useForm } from 'vee-validate'
import { computed, nextTick, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

configure({
  validateOnBlur: false,
})

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: FaqItemQuestionValue.createForm,
  validationSchema: toTypedSchema(faqItemQuestionCreateSchema),
})

const [question] = defineField('question')
const [answer] = defineField('answer')

const { mutate, isPending } = useMutation({
  mutationFn: FaqItemQuestionAction.create,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Pregunta frecuente creada correctamente')
    queryClient.invalidateQueries({ queryKey: ['faq-item-questions'] })
    resetForm()
    emit('close')
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error')
  },
})

const onSubmit = handleSubmit((formValues) => {
  mutate(formValues)
})

// Control de apertura, cierre y foco automático
watch(
  () => props.isOpen,
  async (newIsOpen) => {
    if (newIsOpen) {
      await nextTick()
      modalRef.value?.focus()
      nameInputRef.value?.focus()
    }
  },
)

const handleClose = () => {
  resetForm()
  emit('close')
}

const disabled = computed<boolean>(() => isPending.value || !meta.value.valid)
</script>

<template>
  <div
    v-if="isOpen"
    ref="modalRef"
    @keydown.esc.stop="handleClose"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 outline-none"
  >
    <form
      @submit.prevent="onSubmit"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-xl overflow-hidden transition-all"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800"
      >
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Nueva Opinión</h3>
        <button
          type="button"
          @click="handleClose"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
        <!-- Input Name -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Pregunta
          </label>
          <input
            ref="nameInputRef"
            type="text"
            v-model="question"
            placeholder="Ej. Camila R."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.question" class="text-red-500 text-xs mt-1 block">{{
            errors.question
          }}</span>
        </div>

        <!-- Input Rating (Estrellas) -->

        <!-- Input Text (Comentario) -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Respuesta
          </label>
          <textarea
            v-model="answer"
            rows="3"
            placeholder="Escribe lo que dijo el cliente..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          ></textarea>
          <span v-if="errors.answer" class="text-red-500 text-xs mt-1 block">{{
            errors.answer
          }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800"
      >
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="disabled"
        >
          {{ isPending ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>
