<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue3-toastify'
import { userForgotPasswordSchema } from '@/schemas/user.schema'
import { UserValue } from '@/values'
import { useMutation } from '@tanstack/vue-query'
import { UserAction } from '@/bussiness/actions'

configure({
  validateOnBlur: false,
})

const textEmailInputRef = ref<HTMLInputElement | null>(null)

const { handleSubmit, defineField, errors, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(userForgotPasswordSchema),
  initialValues: UserValue.forgotPassword,
})

const [email, emailAttrs] = defineField('email')

const { mutate, isPending } = useMutation({
  mutationFn: UserAction.forgotPassword,
  onSuccess: (data) => {
    toast.success(data.message || 'Correo de recuperación enviado con éxito')
    resetForm()
    setTimeout(() => {
      textEmailInputRef.value?.focus()
    }, 600)
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al enviar el correo')
  },
})

// Conectamos el submit con la mutación de TanStack Query pasando el valor del email
const onSubmit = handleSubmit((values) => {
   console.log(window.location.origin)
  mutate(values)
})

onMounted(() => {
  textEmailInputRef.value?.focus()
})

const disabled = computed(() => isPending.value || !meta.value.valid)
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo / Marca superior -->
    <div class="flex flex-col items-center mb-6">
      <div
        class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md mb-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
          Recuperar contraseña
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ingresa tu correo electrónico y te enviaremos un enlace de recuperación.
        </p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >Correo electrónico</label
          >
          <input
            ref="textEmailInputRef"
            type="email"
            v-model="email"
            v-bind="emailAttrs"
            placeholder="tu@correo.com"
            class="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />
          <span v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{
            errors.email
          }}</span>
        </div>

        <button
          type="submit"
          :disabled="disabled"
          class="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{{ isPending ? 'Enviando enlace...' : 'Enviar enlace de recuperación' }}</span>
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
