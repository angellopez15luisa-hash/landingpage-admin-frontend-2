<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { CatalogItemAction } from '@/bussiness/actions/catalog-item.action'
import { CatalogCategoryAction } from '@/bussiness/actions/catalog-category.action'
import { toast } from 'vue3-toastify'
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { catalogItemCreateSchema } from '@/schemas/catalog-item.schema'
import { CatalogItemValue } from '@/values'

configure({
  validateOnBlur: false,
})

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const titleInputRef = ref<HTMLInputElement | null>(null)
const queryClient = useQueryClient()

const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const defaultImageUrl = ref(
  'https://res.cloudinary.com/mivh0wir/image/upload/v1786688403/landing-page/hamkxcbcp4abe0mdsho1.jpg',
)

// Referencia para limpiar el input file físicamente en el DOM
const fileInputRef = ref<HTMLInputElement | null>(null)

// Obtenemos las categorías para llenar el selector dinámicamente
const { data: categories } = useQuery({
  queryKey: ['catalog-categories'],
  queryFn: () => CatalogCategoryAction.getAll(),
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: CatalogItemValue.createForm,
  validationSchema: toTypedSchema(catalogItemCreateSchema),
})

const [title, titleAttrs] = defineField('title')
const [catalogCategoryId, catalogCategoryIdAttrs] = defineField('catalogCategoryId')
const [price, priceAttrs] = defineField('price')
const [badge, badgeAttrs] = defineField('badge')

const { mutate, isPending } = useMutation({
  mutationFn: CatalogItemAction.create,
  onSuccess: async (data) => {
    toast.success(data?.message || 'Producto creado correctamente')
    queryClient.invalidateQueries({ queryKey: ['catalog-items'] })
    handleClose()
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al crear el producto')
  },
})

const onSubmit = handleSubmit((values) => {
  formatTwoDecimals()

  // Creamos el FormData para enviar textos y el archivo binario juntos
  const formData = new FormData()
  formData.append('title', values.title!)
  formData.append('catalogCategoryId', String(values.catalogCategoryId))
  formData.append('price', String(values.price))
  formData.append('badge', values.badge!)

  // Adjuntamos la imagen si el usuario seleccionó una nueva

  formData.append('imagePath', selectedFile.value!)

  mutate(formData)
})

// Función cuando seleccionan un archivo
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Función para limpiar la imagen seleccionada
const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Control de apertura, cierre y foco automático
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
      price.value = num.toFixed(2)
    }
  }
}

const handleClose = () => {
  resetForm()
  removeImage()
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
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Nuevo Producto</h3>
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
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Título del Producto -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Título del Producto
          </label>
          <input
            ref="titleInputRef"
            type="text"
            v-model="title"
            v-bind="titleAttrs"
            placeholder="Ej. Oversized Cyber Hoodie"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.title" class="text-red-500 text-xs mt-1 block">{{
            errors.title
          }}</span>
        </div>

        <!-- Categoría del Catálogo -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Categoría
          </label>
          <select
            v-model.number="catalogCategoryId"
            v-bind="catalogCategoryIdAttrs"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="0" disabled>Seleccione una categoría</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.text }}
            </option>
          </select>
          <span v-if="errors.catalogCategoryId" class="text-red-500 text-xs mt-1 block">{{
            errors.catalogCategoryId
          }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Precio -->
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              v-model.number="price"
              v-bind="priceAttrs"
              placeholder="0.00"
              @blur="formatTwoDecimals"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span v-if="errors.price" class="text-red-500 text-xs mt-1 block">{{
              errors.price
            }}</span>
          </div>

          <!-- Badge -->
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Badge (Etiqueta opcional)
            </label>
            <input
              type="text"
              v-model="badge"
              v-bind="badgeAttrs"
              placeholder="Ej. Más Vendido, Nuevo..."
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span v-if="errors.badge" class="text-red-500 text-xs mt-1 block">{{
              errors.badge
            }}</span>
          </div>
        </div>

        <!-- Imagen del Producto -->
        <!-- Imagen del Producto -->
        <div class="col-span-2">
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Imagen del Producto
          </label>

          <!-- Contenedor General con Borde Unificado -->
          <div
            class="flex items-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden transition-colors hover:border-emerald-500"
          >
            <!-- Botón Izquierdo (Sin bordes redondeados propios para que se pegue perfecto) -->
            <button
              type="button"
              @click="fileInputRef?.click()"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-medium transition-colors cursor-pointer shrink-0 rounded-none border-r border-emerald-700"
            >
              Seleccionar imagen
            </button>

            <!-- Texto / Nombre del archivo seleccionado -->
            <input
              type="text"
              readonly
              :value="selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'"
              class="w-full bg-transparent px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer truncate"
              @click="fileInputRef?.click()"
            />

            <!-- Input file real oculto -->
            <input
              ref="fileInputRef"
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="hidden"
            />
          </div>

          <!-- Vista Previa Centrada abajo -->
          <!-- Vista Previa Centrada abajo (Ahora un poco más grande: w-40 h-40) -->
          <div class="flex justify-start mt-4">
            <div
              class="relative group w-40 h-40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm"
            >
              <img
                :src="imagePreview || defaultImageUrl"
                alt="Vista previa"
                class="w-full h-full object-cover"
              />

              <!-- Botón X para eliminar -->
              <button
                v-if="selectedFile"
                type="button"
                @click="removeImage"
                class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors cursor-pointer"
                title="Quitar imagen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
            </div>
          </div>
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
          {{ isPending ? 'Guardando...' : 'Guardar Producto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Ocultar flechas en inputs numéricos */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
