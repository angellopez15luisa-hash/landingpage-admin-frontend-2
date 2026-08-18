<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { NavbarAction } from '@/bussiness/actions'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { navbarSchema } from '@/schemas/navbar.schema'
import { NavbarValue } from '@/values'
import { toTypedSchema } from '@vee-validate/zod'
import { useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue3-toastify'

const isEditing = ref(false)
// const navbarId = ref<number>(0)
const queryClient = useQueryClient()
const textLogoInputRef = ref<HTMLInputElement | null>(null)

const { data: navbar } = useQuery({
  queryKey: ['navbar'],
  queryFn: () => NavbarAction.get(),
  retry: false,
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: NavbarValue.editForm,
  validationSchema: toTypedSchema(navbarSchema),
})

const [textLogo, textLogoAttrs] = defineField('textLogo')
const [hrefLogo, hrefLogoAttrs] = defineField('hrefLogo')
const [textBtn, textBtnAttrs] = defineField('textBtn')
const [hrefBtn, hrefBtnAttrs] = defineField('hrefBtn')

const { mutate, isPending } = useMutation({
  mutationFn: NavbarAction.update,
  onSuccess: async (response, variables) => {
    const newValues = variables.data
    queryClient.setQueryData(['navbar'], (oldData: any) => {
      return {
        ...oldData,
        ...newValues,
      }
    })
    resetForm({ values: newValues })
    queryClient.invalidateQueries({ queryKey: ['navbar'] })
    isEditing.value = false
    toast.success(response?.message || 'Actualizado correctamente')

    // queryClient.invalidateQueries({ queryKey: ['navbar'] })
    // isEditing.value = false
    // toast.success(data?.message)
  },
  onError: (data) => {
    toast.error(data.message)
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({ id: values.id, data: values })
})

watch(
  [() => navbar.value, () => isEditing.value],
  ([valueNavbar], [valueIsEditing]) => {
    if (valueNavbar || valueIsEditing) {
      resetForm({ values: valueNavbar }, { force: true })
      // navbarId.value = valueNavbar!.id
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
      textLogoInputRef.value?.focus()
    }
  },
)

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    nextTick(() => {
      const input = textLogoInputRef.value
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
    class="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors"
  >
    <!-- Encabezado con Título y el Botón de Habilitar Edición alineados -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
          Configuración del Header (Logo y Botón)
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Actualiza los textos y enlaces principales de la cabecera de tu landing page.
        </p>
      </div>

      <!-- Botón de Habilitar / Bloquear Edición -->
      <!-- Botón de Habilitar / Bloquear Edición -->
      <button
        type="button"
        @click="toggleEditMode"
        class="px-3.5 py-2 text-xs font-medium rounded-lg transition-colors border shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        :class="
          isEditing
            ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
        "
      >
        <!-- Ícono condicional -->
        <svg
          v-if="isEditing"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          ></path>
        </svg>
        <svg
          v-else
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>

        <span>{{ isEditing ? 'Bloquear Edición' : 'Habilitar Edición' }}</span>
      </button>
    </div>

    <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Text Logo -->
      <div>
        <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >Texto del Logo (text-logo)</label
        >
        <input
          ref="textLogoInputRef"
          type="text"
          v-model="textLogo"
          v-bind="textLogoAttrs"
          :disabled="!isEditing"
          placeholder="Ej. DROP-ZONE"
          class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
          :class="
            !isEditing
              ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
          "
        />
        <span v-if="errors.textLogo" class="text-red-500 text-xs mt-1 block">{{
          errors.textLogo
        }}</span>
      </div>

      <!-- Href Logo -->
      <div class="hidden">
        <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Enlace del Logo (href-logo)
        </label>
        <input
          type="text"
          v-model="hrefLogo"
          v-bind="hrefLogoAttrs"
          :disabled="!isEditing"
          placeholder="Ej. / o #"
          class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
          :class="
            !isEditing
              ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
          "
        />
        <span v-if="errors.hrefLogo" class="text-red-500 text-xs mt-1 block">{{
          errors.hrefLogo
        }}</span>
      </div>

      <!-- Text Btn -->
      <div>
        <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >Texto del Botón (text-btn)</label
        >
        <input
          type="text"
          v-model="textBtn"
          v-bind="textBtnAttrs"
          :disabled="!isEditing"
          placeholder="Ej. Pedir"
          class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
          :class="
            !isEditing
              ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
          "
        />
        <span v-if="errors.textBtn" class="text-red-500 text-xs mt-1 block">{{
          errors.textBtn
        }}</span>
      </div>

      <!-- Href Btn -->
      <div>
        <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >Enlace del Botón (href-btn)</label
        >
        <input
          type="text"
          v-model="hrefBtn"
          v-bind="hrefBtnAttrs"
          :disabled="!isEditing"
          placeholder="Ej. #contacto"
          class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
          :class="
            !isEditing
              ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
          "
        />
        <span v-if="errors.hrefBtn" class="text-red-500 text-xs mt-1 block">{{
          errors.hrefBtn
        }}</span>
      </div>

      <!-- Botón de Guardar (Se desactiva si isEditing es false) -->
      <div class="md:col-span-2 flex justify-end mt-2">
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
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

<style scoped></style>
