<script setup lang="ts">
import { FaqItemQuestionAction } from '@/bussiness/actions'
import type { FaqItemQuestion } from '@/types/faq-item-question.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import Swal from 'sweetalert2'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import AppSpinner from './AppSpinner.vue'
import CreateFrequentlyQuestionsModal from './CreateFrequentlyQuestionsModal.vue'
import EditFrequentlyQuestionsModal from './EditFrequentlyQuestionsModal.vue'

const queryClient = useQueryClient()
const isModalOpen = ref(false)
const selectedItem = ref<FaqItemQuestion>({} as FaqItemQuestion)

// Control para el modal de crear
const isCreateModalOpen = ref(false)
// Estados de Buscador, Filtro de Estado y Paginación
const searchQuery = ref('')
const estadoFiltro = ref('todos') // 'todos' | 'activo' | 'inactivo'
const paginaActual = ref(1)
const porPagina = ref(5)

const {
  data: faqItemQuestions,
  refetch,
  isFetching,
} = useQuery({
  queryKey: ['faq-item-questions'],
  queryFn: () => FaqItemQuestionAction.getAll(),
})

const abrirModal = (item: FaqItemQuestion) => {
  selectedItem.value = { ...item }
  isModalOpen.value = true
}

const abrirModalCrear = () => {
  isCreateModalOpen.value = true
}

// 1. Filtrar opiniones según el buscador (por nombre o texto) y el estado seleccionado
const questionsFiltradas = computed(() => {
  if (!faqItemQuestions.value) return []

  return faqItemQuestions.value.filter((item) => {
    const query = searchQuery.value.toLowerCase().trim()
    const question = (item.question ?? '').toLowerCase()
    const answer = (item.answer ?? '').toLowerCase()

    // Coincidencia con el buscador de texto
    const coincideTexto = !query || question.includes(query) || answer.includes(query)

    // Estado real de la review (manejando isActive o is_active)
    const isActive = Boolean(item.isActive)

    // Coincidencia con el selector de estado
    let coincideEstado = true
    if (estadoFiltro.value === 'activo') {
      coincideEstado = isActive
    } else if (estadoFiltro.value === 'inactivo') {
      coincideEstado = !isActive
    }

    return coincideTexto && coincideEstado
  })
})

// 2. Total de registros basados en el filtro actual
const totalRegistros = computed(() => questionsFiltradas.value.length)

// 3. Total de páginas calculadas según los filtrados
const totalPaginas = computed(() => Math.ceil(totalRegistros.value / porPagina.value) || 1)

// 4. Recorte de opiniones para la página actual
const questionsPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina.value
  const fin = inicio + porPagina.value
  return questionsFiltradas.value.slice(inicio, fin)
})

watch([searchQuery, estadoFiltro], () => {
  paginaActual.value = 1
})

const cambiarPagina = (nuevaPagina: number) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
  }
}

// Mutación para eliminar la opinión
const { mutate } = useMutation({
  mutationFn: (id: FaqItemQuestion['id']) => FaqItemQuestionAction.delete(id),
  onSuccess: (data) => {
    toast.success(data?.message || 'Pregunta frecuente eliminada correctamente')
    queryClient.invalidateQueries({ queryKey: ['faq-item-questions'] })
    if (questionsPaginadas.value.length === 1 && paginaActual.value > 1) {
      paginaActual.value--
    }
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al eliminar')
  },
})

const confirmarEliminacion = (item: FaqItemQuestion) => {
  const isDarkMode = document.documentElement.classList.contains('dark')

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    confirmButtonColor: '#059669',
    cancelButtonColor: '#ef4444',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f8fafc' : '#1e293b',
  }).then((result) => {
    if (result.isConfirmed && item.id) {
      mutate(item.id)
    }
  })
}
</script>

<template>
  <div
    class="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors"
  >
    <!-- Header de la sección con Buscador, Selector de Estado, Botón Recargar y Botón de Agregar -->
    <div
      class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-3">
          <h3 class="text-base font-semibold text-slate-800 dark:text-white">
            Gestión de Preguntas frecuentes de la Landing Page
          </h3>
          <AppSpinner v-if="isFetching" text="Cargando..." />
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Administra las preguntas frecuentes que se realizan los clientes.
        </p>
      </div>

      <div
        class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end"
      >
        <!-- Input de Buscador -->
        <div class="relative w-full sm:w-48">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar autor o texto..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <!-- 👇 NUEVO: Select para Filtrar por Estado -->
        <div class="w-full sm:w-36">
          <select
            v-model="estadoFiltro"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        <!-- Botón Recargar (Refetch) -->
        <button
          @click="refetch()"
          :disabled="isFetching"
          class="inline-flex items-center justify-center p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          title="Actualizar lista"
        >
          <svg
            class="w-4 h-4"
            :class="{ 'animate-spin': isFetching }"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>

        <!-- Botón Agregar Opinión -->
        <button
          @click="abrirModalCrear"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Nueva Pregunta</span>
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto relative">
      <div
        v-if="isFetching && faqItemQuestions"
        class="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/30 backdrop-blur-[0.5px] z-10 flex items-start justify-center pt-12 pointer-events-none"
      >
        <div
          class="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-full shadow-md border border-slate-200 dark:border-slate-700"
        >
          <AppSpinner text="Sincronizando datos..." />
        </div>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/30"
          >
            <th class="px-6 py-3.5">Pregunta</th>

            <th class="px-6 py-3.5">Respuesta</th>
            <th class="px-6 py-3.5">Estado</th>
            <th class="px-6 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          <tr v-if="questionsPaginadas.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-400 text-xs">
              No se encontraron opiniones con los filtros aplicados.
            </td>
          </tr>

          <tr
            v-for="item in questionsPaginadas"
            :key="item.id"
            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
          >
            <!-- Name -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-slate-800 dark:text-slate-200">
                {{ item.question }}
              </div>
            </td>

            <!-- Rating (Estrellas) -->

            <!-- Text -->
            <td class="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
              "{{ item.answer }}"
            </td>

            <!-- Estado (isActive / is_active) -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5"
                :class="
                  (item.isActive ?? (item as any).is_active)
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                "
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="
                    (item.isActive ?? (item as any).is_active) ? 'bg-emerald-500' : 'bg-slate-400'
                  "
                ></span>
                {{ (item.isActive ?? (item as any).is_active) ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4 whitespace-nowrap text-right space-x-1">
              <!-- Botón Editar -->
              <button
                @click="abrirModal(item)"
                class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Editar Opinión"
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

              <!-- Botón Eliminar -->
              <button
                @click="confirmarEliminacion(item)"
                class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Eliminar Opinión"
                v-if="faqItemQuestions!.length > 3"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div
      class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400"
    >
      <div class="flex items-center gap-3">
        <span>
          Showing
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ totalRegistros > 0 ? (paginaActual - 1) * porPagina + 1 : 0 }}
          </span>
          -
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ Math.min(paginaActual * porPagina, totalRegistros) }}
          </span>
          of
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ totalRegistros }}</span>
        </span>

        <div class="flex items-center gap-1.5 ml-4">
          <span>Rows</span>
          <select
            v-model.number="porPagina"
            @change="paginaActual = 1"
            class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option :value="5">5</option>
            <option :value="8">8</option>
            <option :value="10">10</option>
          </select>
        </div>
      </div>

      <!-- Navegación por Números de Página -->
      <div class="flex items-center gap-1">
        <button
          @click="cambiarPagina(paginaActual - 1)"
          :disabled="paginaActual === 1 || totalPaginas === 0"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          &lt;
        </button>

        <button
          v-for="num in totalPaginas"
          :key="num"
          @click="cambiarPagina(num)"
          :class="
            paginaActual === num
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-400 font-semibold border-emerald-300 dark:border-emerald-700'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          "
          class="w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors cursor-pointer"
        >
          {{ num }}
        </button>

        <button
          @click="cambiarPagina(paginaActual + 1)"
          :disabled="paginaActual === totalPaginas || totalPaginas === 0"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
  <CreateFrequentlyQuestionsModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" />
  <EditFrequentlyQuestionsModal
    :isOpen="isModalOpen"
    :id="selectedItem.id"
    @close="isModalOpen = false"
  />
</template>
