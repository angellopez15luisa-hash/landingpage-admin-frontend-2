<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ItemSectionAction } from '@/bussiness/actions/item-section.action.ts'
import type { ItemSection } from '@/types/item-section.type.ts'
import EditNavigationTableModal from './EditNavigationTableModal.vue'

const { data: itemSections } = useQuery({
  queryKey: ['item-sections'],
  queryFn: () => ItemSectionAction.getAll(),
  retry: false,
})
// Los 6 registros de ejemplo que pediste

const isModalOpen = ref(false)
const selectedItem = ref<ItemSection>({} as ItemSection)

const abrirModal = (item: ItemSection) => {
  selectedItem.value = { ...item }
  isModalOpen.value = true
}
</script>

<template>
  <!-- CARD CONTENEDOR DE LA TABLA -->
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors"
  >
    <!-- Título y subtítulo dentro de la tarjeta -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white">Gestión de Enlaces</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Administra la visibilidad de las opciones en el Navbar y Footer.
        </p>
      </div>
    </div>
    <!-- Contenedor interno de la tabla con scroll horizontal si es necesario -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-800">
            <th
              class="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Texto
            </th>
            <th
              class="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Ruta (Href)
            </th>
            <th
              class="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Flag Navbar
            </th>
            <th
              class="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Flag Footer
            </th>
            <th
              class="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr
            v-for="item in itemSections"
            :key="item.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <td class="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ item.text }}
            </td>
            <td class="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              {{ item.href }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="
                  item.flagNavbar
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                "
              >
                {{ item.flagNavbar ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="
                  item.flagFooter
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                "
              >
                {{ item.flagFooter ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-right space-x-2">
              <!-- Botón de Editar con ícono SVG -->
              <button
                class="inline-flex items-center justify-center p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                title="Editar registro"
                @click="abrirModal(item)"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
                <span class="sr-only">Editar</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <EditNavigationTableModal
    :isOpen="isModalOpen"
    :id="selectedItem.id"
    @close="isModalOpen = false"
  />
</template>
