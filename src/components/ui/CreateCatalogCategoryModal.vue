<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CatalogCategoryAction } from '@/bussiness/actions/catalog-category.action'
import { toast } from 'vue3-toastify'
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { CatalogCategoryValue } from "@/values"
import { catalogCategoryCreateSchema } from "@/schemas/catalog-category.schema"

configure({
  validateOnBlur:false
})

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const textInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

// Campo reactivo único para el nombre de la categoría
// const text = ref('')

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: CatalogCategoryValue.createForm, // Asegúrate de tener este valor inicial o usa un objeto vacío por defecto
  validationSchema: toTypedSchema(catalogCategoryCreateSchema),
})

const [text, textAttrs] = defineField('text')

const { mutate, isPending } = useMutation({
  mutationFn: CatalogCategoryAction.create,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Categoría creada correctamente')
    queryClient.invalidateQueries({ queryKey: ['catalog-categories'] })
    resetForm()
    emit('close')
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error')
  },
})

const onSubmit = handleSubmit(values => {
  mutate(values)
})

// Control de apertura, cierre y foco automático
watch(
  () => props.isOpen,
  async (newIsOpen) => {
    if (newIsOpen) {
      await nextTick()
      modalRef.value?.focus()
      textInputRef.value?.focus()
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
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Nueva Categoría</h3>
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
      <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        <!-- Input Text -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Nombre de la Categoría</label
          >
          <input
            ref="textInputRef"
            type="text"
            v-model="text"
            v-bind="textAttrs"
            placeholder="Ej. Accesorios, Zapatillas..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
           <span v-if="errors.text" class="text-red-500 text-xs mt-1 block">{{ errors.text }}</span>
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
          :disabled
        >
          {{ isPending ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>
