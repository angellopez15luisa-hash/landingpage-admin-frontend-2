<script setup lang="ts">
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useUserStore } from '@/bussiness/stores/user.store'
import { toast } from 'vue3-toastify'
import { userUpdatePasswordSchema } from '@/schemas/user.schema'
import { UserValue } from '@/values'
import { useMutation } from '@tanstack/vue-query'
import { UserAction } from '@/bussiness/actions'
import { computed, onMounted, ref } from 'vue'

configure({
  validateOnBlur: false,
})

const userStore = useUserStore()
const textCurrentPasswordInputRef = ref<HTMLInputElement | null>(null)

const { handleSubmit, resetForm, defineField, errors, meta } = useForm({
  validationSchema: toTypedSchema(userUpdatePasswordSchema),
  initialValues: UserValue.updatePassword,
})

const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
const [newPassword, newPasswordAttrs] = defineField('newPassword')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const { mutate, isPending } = useMutation({
  mutationFn: UserAction.updatePassword,
  onSuccess: (data) => {
    toast.success(data?.message || 'Contraseña actualizada correctamente')
    resetForm()
    setTimeout(() => {
      textCurrentPasswordInputRef.value?.focus()
    }, 600)
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al actualizar la contraseña')
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({
    currentPassword: values.currentPassword,
    newPassword: values.newPassword,
  })
})

onMounted(() => {
  textCurrentPasswordInputRef.value?.focus()
})

const disabled = computed(() => isPending.value || !meta.value.valid)
</script>

<template>
  <div class="p-6 md:p-8 max-w-3xl space-y-8">
    <!-- Encabezado de la página -->
    <div class="border-b border-slate-200 dark:border-slate-800 pb-5">
      <h1 class="text-xl font-bold text-slate-900 dark:text-white">Configuración de Perfil</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Administra la información de tu cuenta y actualiza tus credenciales de acceso.
      </p>
    </div>

    <!-- Sección de Información General -->
    <div class="space-y-4">
      <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
        Información de la Cuenta
      </h2>
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-base shadow-inner uppercase shrink-0"
        >
          {{ userStore.user.name ? userStore.user.name.charAt(0) : 'A' }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {{ userStore.user.name }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {{ userStore.user.email }}
          </p>
        </div>
      </div>
    </div>

    <!-- Sección de Seguridad -->
    <div class="space-y-4">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-2">
        <h2
          class="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider"
        >
          Seguridad
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Asegúrate de usar una contraseña larga y segura para proteger el panel.
        </p>
      </div>

      <form
        @submit.prevent="onSubmit"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
      >
        <!-- Título interno de la tarjeta para la acción de contraseña -->
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            Actualizar Contraseña
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ingresa tu contraseña actual y define una nueva clave segura.
          </p>
        </div>

        <!-- Contraseña Actual -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Contraseña Actual</label
          >
          <input
            ref="textCurrentPasswordInputRef"
            type="password"
            v-model="currentPassword"
            v-bind="currentPasswordAttrs"
            placeholder="••••••••••••"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.currentPassword" class="text-red-500 text-xs mt-1 block">{{
            errors.currentPassword
          }}</span>
        </div>

        <!-- Nueva Contraseña -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Nueva Contraseña</label
          >
          <input
            type="password"
            v-model="newPassword"
            v-bind="newPasswordAttrs"
            placeholder="••••••••••••"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.newPassword" class="text-red-500 text-xs mt-1 block">{{
            errors.newPassword
          }}</span>
        </div>

        <!-- Confirmar Nueva Contraseña -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >Confirmar Nueva Contraseña</label
          >
          <input
            type="password"
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
            placeholder="••••••••••••"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 block">{{
            errors.confirmPassword
          }}</span>
        </div>

        <!-- Botón de Acción -->
        <div class="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            :disabled="disabled"
            class="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {{ isPending ? 'Actualizando...' : 'Actualizar Contraseña' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
