<script setup lang="ts">
import { OrderStepAction } from "@/bussiness/actions"
import type { OrderStep } from "@/types/order-step.type"
import { useQuery } from "@tanstack/vue-query"
import { ref } from 'vue'
import EditOrderStepModal from "./EditOrderStepModal.vue"

const { data: orderSteps } = useQuery({
  queryKey: ['order-steps'],
  queryFn:()=>OrderStepAction.getAll()
})

const isModalOpen = ref(false)
const selectedItem = ref<OrderStep>({} as OrderStep)

const abrirModal = (item: OrderStep ) => {
  selectedItem.value = { ...item }
  isModalOpen.value = true
}
</script>

<template>
  <div
    class="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors"
  >
    <!-- Header de la sección -->
    <div
      class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">Gestión de Pasos (Order Steps)</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Administra la secuencia y la información de los pasos para realizar un pedido.
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
            <th class="px-6 py-3.5 w-20">Número</th>
            <th class="px-6 py-3.5">Título</th>
            <th class="px-6 py-3.5">Descripción</th>
            <th class="px-6 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          <tr
            v-for="(step, index) in orderSteps"
            :key="index"
            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
          >
            <!-- Número del Paso -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
              >
                {{ step.number }}
              </span>
            </td>

            <!-- Título -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-slate-800 dark:text-slate-200">
                {{ step.title }}
              </div>
            </td>

            <!-- Descripción -->
            <td class="px-6 py-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-md">
                {{ step.description }}
              </p>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="abrirModal(step)"
                class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Editar Paso"
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
                    stroke-width="2"
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

  <!-- Modal genérico para edición (puedes adaptarlo después a tu componente modal) -->
  <EditOrderStepModal :isOpen="isModalOpen" :id="selectedItem.id" @close="isModalOpen = false" />
</template>
