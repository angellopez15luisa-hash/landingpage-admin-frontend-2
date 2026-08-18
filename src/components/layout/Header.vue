<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useUserStore } from '@/bussiness/stores/user.store'
import { useQueryClient } from '@tanstack/vue-query'
import Swal from 'sweetalert2'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

defineEmits(['toggle-sidebar'])

// Lee del localStorage al cargar; si no existe, por defecto es true (modo oscuro)
const isDark = ref(localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : true)

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const queryClient = useQueryClient()
const userStore = useUserStore()
const router = useRouter()

const toggleDarkMode = () => {
  const html = document.documentElement
  isDark.value = !isDark.value

  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Cerrar el menú desplegable si se hace click fuera de él
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  // Sincronizamos el DOM y el localStorage según el valor inicial al montar el header
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Función para ir al perfil (puedes ajustar la ruta según tu router)
const handleViewProfile = () => {
  isDropdownOpen.value = false
  router.push({ name: 'profile' }) // Cambia 'profile' por el nombre de tu ruta de perfil si es distinta
}

// Función para cerrar sesión con SweetAlert2
const handleLogout = () => {
  isDropdownOpen.value = false
  const isDarkMode = document.documentElement.classList.contains('dark')

  Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Estás a punto de salir de tu cuenta.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar',
    background: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f8fafc' : '#1e293b',
  }).then((result) => {
    if (result.isConfirmed) {
      userStore.logout()
      queryClient.clear()
      router.replace({ name: 'sign-in' })
    }
  })
}
</script>

<template>
  <!-- TOPBAR / HEADER FIJO -->
  <header
    class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 transition-colors duration-200 z-30"
  >
    <!-- Lado Izquierdo: Botón Hamburguesa + Buscador -->
    <div class="flex items-center gap-3 w-full md:w-96">
      <!-- Botón Hamburguesa para celulares -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden text-slate-600 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        aria-label="Abrir menú"
      >
        <font-awesome-icon icon="bars" class="text-lg" />
      </button>
    </div>

    <!-- Lado Derecho: Acciones (Dark Mode, Avatar & Dropdown Menu) -->
    <div class="flex items-center gap-2 md:gap-3">
      <!-- Botón Dark Mode -->
      <button
        @click="toggleDarkMode"
        class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        title="Cambiar modo"
      >
        <font-awesome-icon
          :icon="isDark ? 'sun' : 'moon'"
          :class="isDark ? 'text-amber-400' : 'text-slate-600'"
        />
      </button>

      <div class="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

      <!-- Contenedor del Dropdown de Usuario -->
      <div class="relative" ref="dropdownRef">
        <!-- Botón del Avatar / Disparador del Dropdown -->
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-2.5 focus:outline-none cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <!-- Avatar con iniciales o imagen -->
          <div class="w-9 h-9 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-sm shadow-inner uppercase">
            {{ userStore.user.name ? userStore.user.name.charAt(0) : 'A' }}
          </div>
          <!-- Nombre y flechita -->
          <div class="hidden lg:flex flex-col text-left leading-tight">
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-wide">
              {{ userStore.user.name }}
            </span>
            <span class="text-[11px] text-slate-400 dark:text-slate-400 font-normal">
              Admin
            </span>
          </div>
          <font-awesome-icon icon="chevron-down" class="text-[10px] text-slate-400 hidden lg:inline ml-1" />
        </button>

        <!-- Menú Desplegable (Dropdown) estilo Pro -->
        <transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-slate-700 dark:text-slate-200"
          >
            <!-- Cabecera del Dropdown con la info del usuario -->
            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p class="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {{ userStore.user.name }}
              </p>
              <p class="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                {{ userStore.user.email }}
              </p>
            </div>

            <!-- Opciones del menú -->
            <div class="py-1">
              <button
                @click="handleViewProfile"
                class="w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <font-awesome-icon icon="user" class="text-slate-400 text-sm w-4" />
                View Profile
              </button>
            </div>

            <div class="h-[1px] bg-slate-100 dark:bg-slate-800 my-1"></div>

            <!-- Botón de Logout -->
            <div class="py-1">
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <font-awesome-icon icon="arrow-right-from-bracket" class="text-sm w-4" />
                Log Out
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>
