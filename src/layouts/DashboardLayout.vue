<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

// Estado para controlar la apertura del menú lateral en celulares
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div
    class="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased flex h-screen overflow-hidden"
  >
    <!-- Backdrop oscuro translúcido para móviles cuando el sidebar está abierto -->
    <div
      v-if="isMobileMenuOpen"
      @click="toggleMobileMenu"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
    ></div>

    <!-- Sidebar Modularizado -->
    <Sidebar :isOpen="isMobileMenuOpen" @close="toggleMobileMenu" />

    <!-- Contenedor Derecho: Header fijo arriba + Main con scroll independiente -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Header fuera del main, con su botón hamburguesa conectado -->
      <Header @toggle-sidebar="toggleMobileMenu" />

      <!-- Main que envuelve al RouterView para renderizar tus vistas -->
      <main class="flex-1 flex flex-col overflow-y-auto">
        <!-- Cambiamos p-4 md:p-6 por un padding superior más reducido (pt-2 o pt-3) -->
        <div class="p-4 w-full flex-1">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
