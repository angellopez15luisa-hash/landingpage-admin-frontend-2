<script setup lang="ts">
import type { CatalogItem } from '@/types/catalog-item.type'
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { CatalogItemAction } from '@/bussiness/actions/catalog-item.action'
import { CatalogCategoryAction } from '@/bussiness/actions/catalog-category.action'
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { catalogItemUpdateSchema } from '@/schemas/catalog-item.schema'
import { toast } from 'vue3-toastify'
import { CatalogItemValue } from '@/values'

configure({
  validateOnBlur: false,
})

const props = defineProps<{
  isOpen: boolean
  id: CatalogItem['id']
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const titleInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

// Estados para el manejo de la imagen
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isImageRemoved = ref(false)

const defaultImageUrl = ref(
  'https://res.cloudinary.com/mivh0wir/image/upload/v1786688403/landing-page/hamkxcbcp4abe0mdsho1.jpg',
)

// 1. Traer datos del producto por ID
const { data: catalogItem } = useQuery({
  queryKey: ['catalog-item', props.id],
  queryFn: () => CatalogItemAction.getById(props.id),
  retry: false,
  enabled: computed(() => Boolean(props.id) && props.isOpen),
})

// Saber si el producto original tenía una imagen real y válida (no vacía y diferente a la por defecto)
const hasOriginalImage = computed(() => {
  const originalPath = catalogItem.value?.imagePath
  return originalPath && originalPath.trim() !== '' && originalPath !== defaultImageUrl.value
})

// 2. Traer categorías para el select
const { data: categories } = useQuery({
  queryKey: ['catalog-categories'],
  queryFn: () => CatalogCategoryAction.getAll(),
})

const { handleSubmit, resetForm, defineField, errors, meta, setFieldValue } = useForm({
  initialValues: CatalogItemValue.editForm,
  validationSchema: toTypedSchema(catalogItemUpdateSchema),
})

const [title, titleAttrs] = defineField('title')
const [catalogCategoryId, catalogCategoryIdAttrs] = defineField('catalogCategoryId')
const [price, priceAttrs] = defineField('price')
const [badge, badgeAttrs] = defineField('badge')
const [isActive, isActiveAttrs] = defineField('isActive')

const { mutate, isPending } = useMutation({
  mutationFn: CatalogItemAction.update,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Producto actualizado correctamente')
    queryClient.invalidateQueries({ queryKey: ['catalog-items'] })
    handleClose()
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al actualizar')
  },
})

// Sincronizar datos y formulario cada vez que llegue el producto o se abra el modal
watch(
  () => [props.isOpen, catalogItem.value] as const,
  ([isOpen, values]) => {
    if (isOpen && values) {
      resetForm({ values }, { force: true })
      selectedFile.value = null
      isImageRemoved.value = false
      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }

      // Si el producto tiene un imagePath válido lo usamos, de lo contrario usamos la imagen por defecto
      if (values.imagePath && values.imagePath.trim() !== '') {
        imagePreview.value = values.imagePath
      } else {
        imagePreview.value = defaultImageUrl.value
        isImageRemoved.value = true
      }
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.isOpen,
  async (newIsOpen) => {
    if (newIsOpen) {
      await nextTick()
      modalRef.value?.focus()
      titleInputRef.value?.focus()
    }
  },
)

const formatTwoDecimals = () => {
  if (price.value !== null && price.value !== undefined && price.value !== '') {
    const num = Number(price.value)
    if (!isNaN(num)) {
      setFieldValue('price', num.toFixed(2))
    }
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
    isImageRemoved.value = false
  }
}

const restoreOriginalImage = () => {
  selectedFile.value = null
  isImageRemoved.value = false
  imagePreview.value = catalogItem.value?.imagePath || defaultImageUrl.value
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const removeImageCompletely = () => {
  selectedFile.value = null
  isImageRemoved.value = true
  imagePreview.value = defaultImageUrl.value
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const onSubmit = handleSubmit((values) => {
  formatTwoDecimals()

  const formData = new FormData()
  formData.append('title', values.title!)
  formData.append('catalogCategoryId', String(values.catalogCategoryId))
  formData.append('price', String(values.price))
  formData.append('badge', values.badge || '')
  formData.append('isActive', String(values.isActive))

  if (selectedFile.value) {
    formData.append('imagePath', selectedFile.value)
  } else if (isImageRemoved.value) {
    formData.append('removeImage', 'true')
  }

  mutate({ id: props.id, data: formData })
})

const handleClose = () => {
  resetForm()
  selectedFile.value = null
  isImageRemoved.value = false
  imagePreview.value = defaultImageUrl.value
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
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Editar Producto</h3>
        <button type="button" @click="handleClose" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Título -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
          <input ref="titleInputRef" type="text" v-model="title" v-bind="titleAttrs" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500" />
          <span v-if="errors.title" class="text-red-500 text-xs mt-1 block">{{ errors.title }}</span>
        </div>

        <!-- Categoría -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
          <select v-model.number="catalogCategoryId" v-bind="catalogCategoryIdAttrs" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer">
            <option value="0" disabled>Seleccione una categoría</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.text }}</option>
          </select>
          <span v-if="errors.catalogCategoryId" class="text-red-500 text-xs mt-1 block">{{ errors.catalogCategoryId }}</span>
        </div>

        <!-- Precio y Badge -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Precio</label>
            <input type="number" step="0.01" v-model.number="price" v-bind="priceAttrs" @blur="formatTwoDecimals" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <span v-if="errors.price" class="text-red-500 text-xs mt-1 block">{{ errors.price }}</span>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Badge</label>
            <input type="text" v-model="badge" v-bind="badgeAttrs" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500" />
            <span v-if="errors.badge" class="text-red-500 text-xs mt-1 block">{{ errors.badge }}</span>
          </div>
        </div>

        <!-- Activo -->
        <label class="flex items-center gap-3 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input type="checkbox" v-model="isActive" v-bind="isActiveAttrs" class="w-4 h-4 text-emerald-600 border-slate-300 rounded cursor-pointer" />
          <span class="text-sm text-slate-700 dark:text-slate-300">Producto Activo</span>
        </label>

        <!-- Imagen del Producto -->
        <div class="col-span-2">
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Imagen del Producto</label>
          <div class="flex items-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden transition-colors hover:border-emerald-500">
            <button type="button" @click="fileInputRef?.click()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-medium transition-colors cursor-pointer shrink-0 rounded-none border-r border-emerald-700">Seleccionar imagen</button>
            <input type="text" readonly :value="selectedFile ? selectedFile.name : (isImageRemoved ? 'Sin imagen (por defecto)' : (catalogItem?.imagePath ? 'Imagen actual cargada' : 'Ningún archivo seleccionado'))" class="w-full bg-transparent px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer truncate" @click="fileInputRef?.click()" />
            <input ref="fileInputRef" type="file" @change="handleFileChange" accept="image/*" class="hidden" />
          </div>

          <div class="flex justify-start mt-4">
            <div class="relative group w-40 h-40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm">
              <img :src="imagePreview || defaultImageUrl" alt="Vista previa" class="w-full h-full object-cover" />

              <button v-if="imagePreview !== defaultImageUrl" type="button" @click="removeImageCompletely" class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition-colors cursor-pointer" title="Quitar imagen y dejar por defecto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </button>

              <button v-if="hasOriginalImage && (selectedFile || isImageRemoved)" type="button" @click="restoreOriginalImage" class="absolute bottom-1 right-1 bg-slate-700 text-white rounded-full px-2 py-1 shadow hover:bg-slate-800 transition-colors cursor-pointer text-[10px] font-medium" title="Restaurar imagen original">
                Restaurar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <button type="button" @click="handleClose" class="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 transition-colors cursor-pointer">Cancelar</button>
        <button type="submit" class="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" :disabled="disabled">{{ isPending ? 'Guardando...' : 'Guardar Cambios' }}</button>
      </div>
    </form>
  </div>
</template>
