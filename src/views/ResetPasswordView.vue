<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { configure, useForm } from 'vee-validate'
// import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue3-toastify'
import { UserAction } from '@/bussiness/actions'
import { userResetPasswordSchema } from '@/schemas/user.schema'
import { UserValue } from '@/values'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
// import { userResetPasswordSchema } from '@/schemas/user.schema' // Asegúrate de tener tu esquema para el nuevo password
// import { UserValue } from '@/values'
// import { useMutation } from '@tanstack/vue-query'
// import { UserAction } from '@/bussiness/actions'

configure({
  validateOnBlur: false,
})

const route = useRoute()
const router = useRouter()
const token = ref<string>('')
const isValidatingToken = ref<boolean>(true) // Estado opcional para controlar carga si lo deseas

const newPasswordInputRef = ref<HTMLInputElement | null>(null)

// 1. Capturamos el token de los query params al montar el componente
onMounted(async () => {
  // const tokenQuery = route.query.token
  // if (typeof tokenQuery === 'string' && tokenQuery.trim() !== '') {
  //   token.value = tokenQuery
  // } else {
  //   toast.error('El enlace de recuperación es inválido o ha expirado.')
  //   setTimeout(() => {
  //     router.replace({ name: 'sign-in' })
  //   }, 1500)
  // }

  // newPasswordInputRef.value?.focus()
  const tokenQuery = route.query.token

  if (typeof tokenQuery !== 'string' || tokenQuery.trim() === '') {
    toast.error('El enlace de recuperacion es invalido')
    setTimeout(() => {
      router.replace({ name: 'sign-in' })
    }, 1500)
    return
  }
  token.value = tokenQuery
  try {
    // Llamamos a tu acción que consume el backend para verificar el token
    await UserAction.verifyResetToken(token.value)

    // Si pasa la validación exitosamente, enfocamos el input
    newPasswordInputRef.value?.focus()
  } catch (error: unknown) {
    const err = error as any // Casteo rápido para leer la respuesta de Axios/Fetch
    toast.error(
      err?.response?.data?.message || 'El enlace de recuperación es inválido o ha expirado.',
    )
    setTimeout(() => {
      router.replace({ name: 'sign-in' })
    }, 2000)
  } finally {
    isValidatingToken.value = false
  }
})

const { handleSubmit, defineField, errors, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(userResetPasswordSchema),
  initialValues: UserValue.resetPasswordForm, // { password: '', confirmPassword: '' } o similar
})

const [newPassword, newPasswordAttrs] = defineField('newPassword')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const { mutate, isPending } = useMutation({
  mutationFn: UserAction.resetPassword,
  onSuccess: (data) => {
    toast.success(data.message || 'Contraseña actualizada con éxito')
    resetForm()
    newPasswordInputRef.value?.focus()
    setTimeout(() => {
      router.replace({ name: 'sign-in' })
    }, 2000)
  },
  onError: (error) => {
    toast.error(error.message || 'Error al restablecer la contraseña')
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({ token: token.value, data: values })
})

const disabled = computed(() => isPending.value || !meta.value.valid || !token.value)
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo / Marca superior -->
    <div class="flex flex-col items-center mb-6">
      <div
        class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md mb-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <span class="text-lg font-bold text-slate-800 dark:text-white tracking-wide">Vireo</span>
    </div>

    <!-- Tarjeta Principal -->
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 transition-all"
    >
      <!-- Encabezado -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Restablecer contraseña
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ingresa tu nueva contraseña para asegurar tu cuenta.
        </p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Nueva contraseña -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >Contraseña nueva</label
          >
          <input
            ref="newPasswordInputRef"
            v-model="newPassword"
            v-bind="newPasswordAttrs"
            type="password"
            placeholder="••••••••"
            class="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />

          <span v-if="errors.newPassword" class="text-red-500 text-xs mt-1 block">{{
            errors.newPassword
          }}</span>
        </div>

        <!-- Confirmar contraseña -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >Confirmar contraseña</label
          >
          <input
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
            type="password"
            placeholder="••••••••"
            class="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />

          <span v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 block">{{
            errors.confirmPassword
          }}</span>
        </div>

        <button
          type="submit"
          class="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled
        >
          <span>{{ isPending ? 'Actualizando...' : 'Restablecer contraseña' }}</span>
        </button>

        <div class="text-center mt-4">
          <router-link
            :to="{ name: 'sign-in' }"
            class="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors"
          >
            &larr; Volver al inicio de sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
