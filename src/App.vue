<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()

const forceRefresh = (event: PageTransitionEvent) => {
  // persisted es true si la página se cargó desde la memoria RAM (BFCache)
  if (event.persisted) {
    // Opción 1: Forzar a Vue Router a revaluar la ruta actual
    router.go(0)

    // Opción 2: Recarga total del navegador si la caché es muy agresiva
    window.location.reload()
  }
}

onMounted(() => {
  window.addEventListener('pageshow', forceRefresh)

  // console.log(import.meta.env.VITE_PORT)
})

onUnmounted(() => {
  window.removeEventListener('pageshow', forceRefresh)
})
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
</template>

<style scoped></style>
