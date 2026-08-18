<script setup lang="ts">
import type { HeroSection } from '@/types/hero-section.type'
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { HeroSectionAction } from '@/bussiness/actions/hero-section.action'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { heroSectionSchema } from '@/schemas/hero-section.schema'
import { toast } from 'vue3-toastify'
import { HeroSectionValue } from '@/values/hero-section.value'

const props = defineProps<{
  isOpen: boolean
  id: HeroSection['id']
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const tagInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

// Estados para el manejo de la imagen
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const { data: heroSection } = useQuery({
  queryKey: ['hero-section', props.id],
  queryFn: () => HeroSectionAction.getById(props.id),
  retry: false,
  enabled: computed(() => Boolean(props.id) && props.isOpen),
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: HeroSectionValue.editForm,
  validationSchema: toTypedSchema(heroSectionSchema),
})

const [tag, tagAttrs] = defineField('tag')
const [title, titleAttrs] = defineField('title')
const [highlightText, highlightTextAttrs] = defineField('highlightText')
const [description, descriptionAttrs] = defineField('description')

const { mutate, isPending } = useMutation({
  mutationFn: HeroSectionAction.update,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Banner actualizado correctamente')
    queryClient.invalidateQueries({ queryKey: ['hero-sections'] })
    handleClose()
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al actualizar')
  },
})

// Sincronizamos los datos y la vista previa de la imagen al cargar el registro
watch(
  ()=>[props.isOpen,heroSection.value] as const,
  ([isOpen,values]) => {
    if (isOpen&&values) {
      resetForm({ values }, { force: true })
      selectedFile.value = null
      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }
      imagePreview.value = values.imagePath || null
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.isOpen,
  async (newIsOpen) => {
    if (newIsOpen) {
      await nextTick()
      modalRef.value?.focus()
      tagInputRef.value?.focus()
    }
  },
)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const removeSelectedFile = () => {
  selectedFile.value = null
  imagePreview.value = heroSection.value?.imagePath || null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const onSubmit = handleSubmit((values) => {
  const formData = new FormData()
  formData.append('tag', values.tag!)
  formData.append('title', values.title!)
  formData.append('highlightText', values.highlightText!)
  formData.append('description', values.description!)

  // Solo si el usuario seleccionó un archivo nuevo lo mandamos
  if (selectedFile.value) {
    formData.append('imagePath', selectedFile.value)
  }

  mutate({ id: props.id, data: formData })
})

const handleClose = () => {
  resetForm()
  selectedFile.value = null
  imagePreview.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
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
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Editar Banner</h3>
        <button
          type="button"
          @click="handleClose"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Tag -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Etiqueta (tag)</label>
          <input
            ref="tagInputRef"
            type="text"
            v-model="tag"
            v-bind="tagAttrs"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.tag" class="text-red-500 text-xs mt-1 block">{{ errors.tag }}</span>
        </div>

        <!-- Title y Highlight Text -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Título (title)</label>
            <input
              type="text"
              v-model="title"
              v-bind="titleAttrs"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span v-if="errors.title" class="text-red-500 text-xs mt-1 block">{{ errors.title }}</span>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Texto Resaltado (highlightText)</label>
            <input
              type="text"
              v-model="highlightText"
              v-bind="highlightTextAttrs"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span v-if="errors.highlightText" class="text-red-500 text-xs mt-1 block">{{ errors.highlightText }}</span>
          </div>
        </div>

        <!-- Imagen del Banner (Input File + Vista Previa) -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Imagen del Banner</label>
          <div class="flex items-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden transition-colors hover:border-emerald-500">
            <button
              type="button"
              @click="fileInputRef?.click()"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-medium transition-colors cursor-pointer shrink-0 rounded-none border-r border-emerald-700"
            >
              Seleccionar imagen
            </button>
            <input
              type="text"
              readonly
              :value="selectedFile ? selectedFile.name : (heroSection?.imagePath ? 'Imagen actual cargada' : 'Ningún archivo seleccionado')"
              class="w-full bg-transparent px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer truncate"
              @click="fileInputRef?.click()"
            />
            <input ref="fileInputRef" type="file" @change="handleFileChange" accept="image/*" class="hidden" />
          </div>

          <!-- Vista previa de la imagen -->
          <div v-if="imagePreview" class="flex justify-start mt-4">
            <div class="relative group w-40 h-40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm">
              <img :src="imagePreview" alt="Vista previa" class="w-full h-full object-cover" />

              <button
                v-if="selectedFile"
                type="button"
                @click="removeSelectedFile"
                class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition-colors cursor-pointer"
                title="Descartar nueva imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción (description)</label>
          <textarea
            v-model="description"
            v-bind="descriptionAttrs"
            rows="3"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          ></textarea>
          <span v-if="errors.description" class="text-red-500 text-xs mt-1 block">{{ errors.description }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
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
