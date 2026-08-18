<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(true)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <!-- Contenedor principal con soporte total para transiciones de tema -->
  <div
    class="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-800 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-300"
  >
    <!-- EFECTO DE DEGRADADO DE FONDO (Manchas de luz difuminadas idénticas al diseño) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Luz superior izquierda / lateral -->
      <div
        class="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl"
      ></div>
      <!-- Luz inferior derecha -->
      <div
        class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-purple-600/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Header superior derecho: Selector de Idioma (EN) y Botón de Tema (Sol / Luna) -->
    <header class="w-full p-6 flex justify-end items-center space-x-3 absolute top-0 left-0 z-20">
      <!-- Botón de Idioma (EN) -->
      <!-- <button class="h-9 px-3 rounded-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm">
        EN
      </button> -->

      <!-- Botón de Tema (Sol / Luna) -->
      <button
        @click="toggleTheme"
        class="w-9 h-9 rounded-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm"
        :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <!-- Icono de Sol (Se muestra en modo oscuro) -->
        <svg
          v-if="isDark"
          class="w-4 h-4 text-amber-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          ></path>
        </svg>

        <!-- Icono de Luna (Se muestra en modo claro) -->
        <svg
          v-else
          class="w-4 h-4 text-slate-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </header>

    <!-- Contenido central (Login o Recuperar Contraseña) -->
    <main class="flex-grow flex items-center justify-center p-4 z-10">
      <router-view />
    </main>

    <!-- Footer inferior -->
    <footer class="py-6 text-center text-xs text-slate-400 dark:text-slate-500 z-10">
      Al continuar, aceptas los
      <a href="#" class="underline hover:text-slate-600 dark:hover:text-slate-400">Términos</a> y la
      <a href="#" class="underline hover:text-slate-600 dark:hover:text-slate-400"
        >Política de Privacidad</a
      >.
    </footer>
  </div>
</template>
