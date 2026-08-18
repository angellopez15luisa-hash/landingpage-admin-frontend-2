<script setup lang="ts">
import { UserAction } from '@/bussiness/actions'
import { signInSchema } from '@/schemas/user.schema'
import { UserValue } from '@/values'
import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { configure, useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

configure({
  validateOnBlur: false,
})

const router = useRouter()
const textEmailInputRef = ref<HTMLInputElement | null>(null)

const { handleSubmit, defineField, errors, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(signInSchema),
  initialValues: UserValue.signInForm,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const { mutate, isPending } = useMutation({
  mutationFn: UserAction.signIn,
  onSuccess: async () => {
    resetForm()
    setTimeout(() => {
      textEmailInputRef.value?.focus()
    }, 100)
    await router.replace({ name: 'dashboard-layout' })
  },
  onError: (error) => {
    toast.error(error.message || 'Error al iniciar sesión')
  },
})

const onSubmit = handleSubmit((values) => {
  mutate(values)
})

onMounted(() => {
  textEmailInputRef.value?.focus()
})

const disabled = computed(() => !meta.value.valid || isPending.value)
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
          Iniciar sesión
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Te damos la bienvenida — ingresa a tu espacio de trabajo.
        </p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >Correo electrónico o usuario</label
          >
          <input
            ref="textEmailInputRef"
            type="email"
            v-model="email"
            v-bind="emailAttrs"
            placeholder="tucorreo@vireo.io"
            class="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />
          <span v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{
            errors.email
          }}</span>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >Contraseña</label
          >
          <input
            type="password"
            v-model="password"
            v-bind="passwordAttrs"
            placeholder="••••••••"
            class="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />
          <span v-if="errors.password" class="text-red-500 text-xs mt-1 block">{{
            errors.password
          }}</span>
        </div>

        <!-- Botón de Iniciar sesión -->
        <button
          type="submit"
          :disabled="disabled"
          class="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{{ isPending ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
        </button>

        <!-- Enlace de recuperar contraseña movido al final -->
        <div class="flex justify-center pt-2">
          <router-link
            :to="{ name: 'forgot-password' }"
            class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
