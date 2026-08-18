<script setup lang="ts">
import type { ItemSection, ItemSectionEditForm } from '@/types/item-section.type'
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ItemSectionAction } from '@/bussiness/actions'
import { useForm } from 'vee-validate'
import { ItemSectionValue } from '@/values/item-section.value'
import { toTypedSchema } from '@vee-validate/zod'
import { itemSectionSchema } from '@/schemas/item-section.schema'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  isOpen: boolean
  id: ItemSection['id']
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const textInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

const { data: itemSection } = useQuery({
  queryKey: ['item-section', props.id],
  queryFn: () => ItemSectionAction.getById(props.id),
  retry: false,
  enabled: () => !!props.id && props.isOpen,
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm<ItemSectionEditForm>({
  initialValues: ItemSectionValue.editForm,
  validationSchema: toTypedSchema(itemSectionSchema),
})

const [text, textAttrs] = defineField('text')
const [href, hrefAttrs] = defineField('href')
const [flagNavbar, flagNavbarAttrs] = defineField('flagNavbar')
const [flagFooter, flagFooterAttrs] = defineField('flagFooter')

const { mutate, isPending } = useMutation({
  mutationFn: ItemSectionAction.update,
  onSuccess: async (data) => {
    toast.success(data?.message)
    queryClient.invalidateQueries({ queryKey: ['item-sections'] })
    resetForm()
    emit('close')
  },
  onError: (data) => {
    toast.error(data.message)
  },
})

// Sincronizamos los datos y forzamos el foco cuando se abre el modal
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

watch(
  itemSection,
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
      @submit="onSubmit"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden transition-all"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800"
      >
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Editar Enlace</h3>
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
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Texto del Enlace</label
          >
          <input
            ref="textInputRef"
            type="text"
            v-model="text"
            v-bind="textAttrs"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.text" class="text-red-500 text-xs mt-1 block">{{ errors.text }}</span>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Ruta (Href)</label
          >
          <input
            type="text"
            v-model="href"
            v-bind="hrefAttrs"
            disabled
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span v-if="errors.href" class="text-red-500 text-xs mt-1 block">{{ errors.href }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-2">
          <label
            class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            :class="{ hidden: itemSection?.id === 1 }"
          >
            <!-- {{ itemSection?.id }} -->
            <input
              type="checkbox"
              v-model="flagNavbar"
              v-bind="flagNavbarAttrs"
              class="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Flag Navbar</span>
          </label>

          <label
            class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <input
              type="checkbox"
              v-model="flagFooter"
              v-bind="flagFooterAttrs"
              class="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Flag Footer</span>
          </label>
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

        <!-- 🔹 Botón de acción principal con type="submit" -->
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled
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
          <span>Guardar Cambios</span>
        </button>
      </div>
    </form>
  </div>
</template>
