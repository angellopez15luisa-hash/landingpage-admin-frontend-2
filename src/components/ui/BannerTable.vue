<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { HeroSectionAction } from '@/bussiness/actions'
import EditBannerTableModal from './EditBannerTableModal.vue'
import { ref } from "vue"
import type { HeroSection } from "@/types/hero-section.type.ts"

const { data: heroSections } = useQuery({
  queryKey: ['hero-sections'],
  queryFn: () => HeroSectionAction.getAll(),
})
const isModalOpen = ref(false)
const selectedItem = ref<HeroSection>({} as HeroSection)

const abrirModal = (item: HeroSection) => {
  selectedItem.value = { ...item }
  isModalOpen.value = true
}

// 🔹 Datos directos que me pasaste de Postman (sin el ID)
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors"
  >
    <!-- Header de la sección -->
    <div
      class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Gestión de Banners</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Administra las imágenes, etiquetas y textos principales del hero section.
        </p>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/30"
          >
            <th class="px-6 py-3.5">Imagen</th>
            <th class="px-6 py-3.5">Tag</th>
            <th class="px-6 py-3.5">Título y Destacado</th>
            <th class="px-6 py-3.5">Descripción</th>
            <th class="px-6 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          <tr
            v-for="(banner, index) in heroSections"
            :key="index"
            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
          >
            <!-- Imagen del Banner (Miniatura) -->
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                :src="banner.imagePath"
                alt="Banner preview"
                class="w-16 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
              />
            </td>

            <!-- Tag -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
              >
                {{ banner.tag }}
              </span>
            </td>

            <!-- Título y Highlight Text -->
            <td class="px-6 py-4">
              <div class="font-medium text-slate-800 dark:text-slate-200">
                {{ banner.title }}
                <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{
                  banner.highlightText
                }}</span>
              </div>
            </td>

            <!-- Descripción -->
            <td class="px-6 py-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xs">
                {{ banner.description }}
              </p>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="abrirModal(banner)"
                class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Editar Banner"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <EditBannerTableModal :isOpen="isModalOpen" :id="selectedItem.id" @close="isModalOpen = false" />
</template>
