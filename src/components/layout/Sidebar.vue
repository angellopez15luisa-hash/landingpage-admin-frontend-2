<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isOpen: boolean
}>()

defineEmits(['close'])

const isCatalogOpen = ref(true)

const toggleCatalog = () => {
  isCatalogOpen.value = !isCatalogOpen.value
}
</script>

<template>
  <!-- SIDEBAR (Responsive con drawer deslizante en móviles) -->
  <aside
    :class="[
      'fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    ]"
  >
    <div>
      <!-- Logo y botón de cierre para móvil -->
      <div
        class="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold"
          >
            V
          </div>
          <span class="font-bold text-lg tracking-wide">VIREO</span>
        </div>
        <button
          @click="$emit('close')"
          class="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <font-awesome-icon icon="xmark" class="text-lg" />
        </button>
      </div>

      <!-- Navegación -->
      <div class="p-4 space-y-2 overflow-y-auto h-[calc(100vh-8rem)] text-sm">
        <div class="space-y-1">
          <!-- Menú normal: Menu -->
          <router-link
            :to="{ name: 'menu' }"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            active-class="!bg-emerald-100 dark:!bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 !font-semibold"
          >
            <font-awesome-icon icon="pen-to-square" /> Menu
          </router-link>

          <!-- Menú normal: Banner -->
          <router-link
            :to="{ name: 'banner' }"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            active-class="!bg-emerald-100 dark:!bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 !font-semibold"
          >
            <font-awesome-icon icon="tags" /> Banner
          </router-link>

          <!-- Menú normal: How to order -->
          <router-link
            :to="{ name: 'how-order' }"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            active-class="!bg-emerald-100 dark:!bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 !font-semibold"
          >
            <font-awesome-icon icon="square-check" /> How to order
          </router-link>

          <!-- Menú Padre: Catalog -->
          <div class="pt-1">
            <button
              @click="toggleCatalog"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <font-awesome-icon icon="bag-shopping" /> Catalog
              </div>
              <font-awesome-icon
                icon="chevron-right"
                class="text-xs transition-transform duration-200"
                :class="{ 'rotate-90': isCatalogOpen }"
              />
            </button>

            <!-- Submenús Hijos con línea de contorno estructurada forzada -->
            <div
              v-show="isCatalogOpen"
              class="ml-6 pl-4 space-y-1 mt-1 border-l-2 border-slate-300 dark:border-slate-600 block"
            >
              <!-- Hijo 1: Catalog section -->
              <router-link
                :to="{ name: 'catalog-section' }"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                active-class="!bg-emerald-100 dark:!bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 !font-semibold"
              >
                <font-awesome-icon icon="sun" /> Catalog section
              </router-link>

              <!-- Hijo 2: Product -->
              <router-link
                :to="{ name: 'catalog-item' }"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                active-class="!bg-emerald-100 dark:!bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 !font-semibold"
              >
                <font-awesome-icon icon="boxes-stacked" /> Product
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Usuario inferior -->
    <div
      class="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
          class="w-9 h-9 rounded-full object-cover"
          alt="Avatar"
        />
        <div>
          <h4 class="text-xs font-semibold">Jacob Gerrald</h4>
          <p class="text-[10px] text-slate-400">jacobg@vireo.io</p>
        </div>
      </div>
      <font-awesome-icon
        icon="arrow-right-from-bracket"
        class="text-slate-400 text-sm cursor-pointer hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      />
    </div>
  </aside>
</template>
