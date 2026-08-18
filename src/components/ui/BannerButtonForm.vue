<script setup lang="ts">
import { HeroSettingAction } from '@/bussiness/actions'
import { heroSettingSchema } from '@/schemas/hero-setting.schema'
import { HeroSettingValue } from '@/values'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, nextTick, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

const isEditing = ref(false)
const textBtnInputRef = ref<HTMLInputElement | null>(null)
// const heroSettingId = ref<number>(0)
const queryClient = useQueryClient()

// Estado local solo para la maqueta

const { data: heroSetting } = useQuery({
  queryKey: ['heroSetting'],
  queryFn: () => HeroSettingAction.get(),
  retry: false,
})

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  initialValues: HeroSettingValue.editForm,
  validationSchema: toTypedSchema(heroSettingSchema),
})

const [buttonText, buttonTextAttrs] = defineField('buttonText')

const { mutate, isPending } = useMutation({
  mutationFn: HeroSettingAction.update,
  onSuccess: async (data) => {
    queryClient.invalidateQueries({ queryKey: ['heroSetting'] })
    isEditing.value = false
    toast.success(data?.message)
  },
  onError: (data) => {
    toast.error(data.message)
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({ id: values.id, data: values })
})

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    nextTick(() => {
      const input = textBtnInputRef.value
      if (input) {
        input.focus()
        // Mueve el cursor exactamente al final del texto actual
        const length = input.value.length
        input.setSelectionRange(length, length)
      }
    })
  }
}

watch(
  [() => heroSetting.value, () => isEditing.value],
  ([valueHeroSetting], [valueIsEditing]) => {
    if (valueHeroSetting || valueIsEditing) {
      resetForm({ values: valueHeroSetting }, { force: true })
      // heroSettingId.value = valueHeroSetting!.id
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
      textBtnInputRef.value?.focus()
    }
  },
)

const disabled = computed<boolean>(() => !isEditing.value || isPending.value || !meta.value.valid)
</script>

<template>
  <div
    class="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors"
  >
    <!-- Encabezado con Título y el Botón de Habilitar Edición -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
          Texto del Botón del Banner (Hero)
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Personaliza el llamado a la acción (CTA) principal que aparece en el centro de tu landing
          page.
        </p>
      </div>

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
        <!-- Íconos de candado abierto/cerrado -->
        <svg
          v-if="isEditing"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
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

    <form @submit.prevent="onSubmit">
      <!-- Contenedor adaptativo: max-w-md en PC (ocupa aprox la mitad) y w-full en móviles -->
      <div class="w-full space-y-4">
        <!-- Campo único: Texto del Botón -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Texto del Botón (Ej. VER DROP DE LA SEMANA)
          </label>
          <input
            ref="textBtnInputRef"
            type="text"
            v-model="buttonText"
            v-bind="buttonTextAttrs"
            :disabled="!isEditing"
            placeholder="VER DROP DE LA SEMANA"
            class="w-full rounded-lg px-3 py-2 text-sm transition-colors border"
            :class="
              !isEditing
                ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500'
            "
          />
          <span v-if="errors.buttonText" class="text-red-500 text-xs mt-1 block">{{
            errors.buttonText
          }}</span>
        </div>

        <!-- Botón de Guardar -->
        <div class="flex justify-start mt-2">
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
      </div>
    </form>
  </div>
</template>
