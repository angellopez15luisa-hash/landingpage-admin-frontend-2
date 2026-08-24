<script setup lang="ts">
import type { ReviewOpinion } from '@/types/review-opinion.type'
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ReviewOpinionAction } from '@/bussiness/actions/review-opinion.action'
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { reviewOpinionUpdateSchema } from '@/schemas/review-opinion.schema'
import { toast } from 'vue3-toastify'
import { ReviewOpinionValue } from '@/values'

configure({
  validateOnBlur: false,
})

const props = defineProps<{
  isOpen: boolean
  id: ReviewOpinion['id']
  
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

const { data: reviewOpinion } = useQuery({
  queryKey: ['review-opinion', props.id],
  queryFn: () => ReviewOpinionAction.getById(props.id!),
  retry: false,
  enabled: () => !!props.id && props.isOpen,
})

const { handleSubmit, resetForm, defineField, errors, meta, setFieldValue } = useForm({
  initialValues: ReviewOpinionValue.editForm,
  validationSchema: toTypedSchema(reviewOpinionUpdateSchema),
})

const [name, nameAttrs] = defineField('name')
const [rating] = defineField('rating')
const [text, textAttrs] = defineField('text')
const [isActive] = defineField('isActive') // 👈 Campo de estado añadido

const { mutate, isPending } = useMutation({
  mutationFn: ReviewOpinionAction.update,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Opinión actualizada correctamente')
    queryClient.invalidateQueries({ queryKey: ['review-opinions'] })
    resetForm()
    emit('close')
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al actualizar')
  },
})

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

watch(
  reviewOpinion,
  (values) => {
    if (values) {
      // Manejamos por si el backend lo manda como is_active en lugar de isActive
      // const formValues = {
      //   ...values,
      //   isActive: values.isActive ?? (values as any).is_active ?? true,
      // }
      resetForm({ values }, { force: true })
    }
  },
  { deep: true, immediate: true },
)

const handleClose = () => {
  resetForm()
  emit('close')
}

const onSubmit = handleSubmit((values) => {
  if (props.id) {
    mutate({ id: props.id, data: values })
  }
})



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
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Editar Opinión</h3>
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
            Nombre del Autor (Name)
          </label>
          <input
            ref="nameInputRef"
            type="text"
            v-model="name"
            v-bind="nameAttrs"
            placeholder="Ej. Camila R."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.name" class="text-red-500 text-xs mt-1 block">{{ errors.name }}</span>
        </div>

        <!-- Input Rating (Estrellas) -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Calificación (Rating)
          </label>
          <div class="flex items-center gap-1.5 py-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="setFieldValue('rating', star)"
              class="text-2xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              :class="
                star <= (rating || 0) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
              "
            >
              ★
            </button>
            <span class="text-xs text-slate-500 ml-2 font-medium">({{ rating || 0 }}/5)</span>
          </div>
          <span v-if="errors.rating" class="text-red-500 text-xs mt-1 block">{{
            errors.rating
          }}</span>
        </div>

        <!-- Input Text (Comentario) -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Comentario (Text)
          </label>
          <textarea
            v-model="text"
            v-bind="textAttrs"
            rows="3"
            placeholder="Escribe lo que dijo el cliente..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          ></textarea>
          <span v-if="errors.text" class="text-red-500 text-xs mt-1 block">{{ errors.text }}</span>
        </div>

        <!-- 👇 NUEVO: Switch o Checkbox para isActive -->
        <div

          class="pt-2 border-t border-slate-100 dark:border-slate-800"
        >
          <label class="relative flex items-center justify-between cursor-pointer group">
            <span class="flex flex-col">
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300"
                >Estado de visibilidad</span
              >
              <span class="text-[11px] text-slate-400"
                >Si está activo, se mostrará en tu landing page.</span
              >
            </span>

            <div class="relative flex items-center">
              <input type="checkbox" v-model="isActive" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"
              ></div>
            </div>
          </label>
          <!-- <span v-if="errors.isActive" class="text-red-500 text-xs mt-1 block">{{ errors.isActive }}</span> -->
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
