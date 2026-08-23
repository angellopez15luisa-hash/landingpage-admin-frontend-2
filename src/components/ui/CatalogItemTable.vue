<script setup lang="ts">
import { CatalogItemAction } from '@/bussiness/actions'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import type { CatalogItem } from '@/types/catalog-item.type.ts'

import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'
import AppSpinner from './AppSpinner.vue'
import CreateCatalogItemModal from './CreateCatalogItemModal.vue'
import EditCatalogItemModal from './EditCatalogItemModal.vue'

const queryClient = useQueryClient()

const {
  data: products,
  refetch,
  isFetching,
} = useQuery({
  queryKey: ['catalog-items'],
  queryFn: () => CatalogItemAction.getAll(),
})

const isModalOpen = ref(false)
const selectedItem = ref<CatalogItem>({} as CatalogItem)

// Control para el modal de crear
const isCreateModalOpen = ref(false)

// Estados de Buscador y Paginación
const searchQuery = ref('')
const paginaActual = ref(1)
const porPagina = ref(10)

const abrirModal = (item: CatalogItem) => {
  selectedItem.value = { ...item }
  isModalOpen.value = true
}

const abrirModalCrear = () => {
  isCreateModalOpen.value = true
}

// 1. Filtrar productos según el buscador (por título o categoría)
const productsFiltrados = computed(() => {
  if (!products.value) return []
  if (!searchQuery.value.trim()) return products.value

  const query = searchQuery.value.toLowerCase()
  return products.value.filter((prod) => {
    const titleMatch = (prod.title ?? '').toLowerCase().includes(query)
    const categoryMatch = (prod.catalogCategory?.text ?? '').toLowerCase().includes(query)
    return titleMatch || categoryMatch
  })
})

// 2. Total de registros basados en el filtro actual
const totalRegistros = computed(() => productsFiltrados.value.length)

// 3. Total de páginas calculadas según los filtrados
const totalPaginas = computed(() => Math.ceil(totalRegistros.value / porPagina.value) || 1)

// 4. Recorte de productos para la página actual
const productsPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina.value
  const fin = inicio + porPagina.value
  return productsFiltrados.value.slice(inicio, fin)
})

watch(searchQuery, () => {
  paginaActual.value = 1
})

// Cada vez que cambie la cantidad por página, regresamos a la página 1
watch(porPagina, () => {
  paginaActual.value = 1
})

const cambiarPagina = (nuevaPagina: number) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
  }
}

// Mutación para eliminar el producto
const { mutate } = useMutation({
  mutationFn: (id: CatalogItem['id']) => CatalogItemAction.remove(id),
  onSuccess: (data) => {
    toast.success(data?.message || 'Producto eliminado correctamente')
    queryClient.invalidateQueries({ queryKey: ['catalog-items'] })
    if (productsPaginados.value.length === 1 && paginaActual.value > 1) {
      paginaActual.value--
    }
  },
  onError: (error) => {
    toast.error(error?.message || 'Ocurrió un error al eliminar')
  },
})

const confirmarEliminacion = (product: CatalogItem) => {
  const isDarkMode = document.documentElement.classList.contains('dark')

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f8fafc' : '#1e293b',
  }).then((result) => {
    if (result.isConfirmed) {
      mutate(product.id)
    }
  })
}

const displayedPages = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 2 // Vecinas a mostrar a los lados de la actual
  const range: (number | string)[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number | undefined = undefined

  range.push(1)

  for (let i = current - delta; i <= current + delta; i++) {
    if (i < total && i > 1) {
      range.push(i)
    }
  }

  if (total > 1) {
    range.push(total)
  }

  for (const i of range) {
    if (l !== undefined) {
      if (typeof i === 'number' && typeof l === 'number') {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l > 2) {
          rangeWithDots.push('...')
        }
      }
    }
    rangeWithDots.push(i)
    if (typeof i === 'number') {
      l = i
    }
  }

  return rangeWithDots
})
</script>

<template>
  <div
    class="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors"
  >
    <!-- Header de la sección con Buscador, Botón Recargar y Botón de Agregar -->
    <div
      class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-3">
          <h3 class="text-base font-semibold text-slate-800 dark:text-white">
            Gestión de Productos del Catálogo
          </h3>
          <AppSpinner v-if="isFetching" text="Cargando..." />
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Administra los productos y prendas que se muestran en la landing page.
        </p>
      </div>

      <div class="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
        <!-- Input de Buscador -->
        <div class="relative w-full sm:w-56">
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
            placeholder="Buscar producto..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <!-- Botón Recargar (Refetch) -->
        <button
          @click="refetch()"
          :disabled="isFetching"
          class="inline-flex items-center justify-center p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
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

        <!-- Botón Agregar Producto -->
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
          <span>Nuevo Producto</span>
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto relative">
      <div
        v-if="isFetching && products"
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
            <th class="px-6 py-3.5">Producto</th>
            <th class="px-6 py-3.5">Categoría</th>
            <th class="px-6 py-3.5">Precio</th>
            <th class="px-6 py-3.5">Badge</th>
            <th class="px-6 py-3.5">Estado</th>
            <th class="px-6 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          <tr v-if="productsPaginados.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-slate-400 text-xs">
              No se encontraron productos que coincidan "{{ searchQuery }}"
            </td>
          </tr>

          <tr
            v-for="(product, index) in productsPaginados"
            :key="index"
            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <img
                  :src="product.imagePath"
                  alt="Imagen del producto"
                  class="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div class="font-medium text-slate-800 dark:text-slate-200">
                  {{ product.title }}
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium"
              >
                {{ product.catalogCategory?.text || 'Sin categoría' }}
              </span>
            </td>

            <td
              class="px-6 py-4 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-100"
            >
              ${{ product.price }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span
                v-if="product.badge"
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
              >
                {{ product.badge }}
              </span>
              <span v-else class="text-slate-300 dark:text-slate-600">—</span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                  :class="
                    product.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  "
                >
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </span>
                <AppSpinner v-if="isFetching" />
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-right space-x-1">
              <button
                @click="abrirModal(product)"
                class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Editar Producto"
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

              <button
                @click="confirmarEliminacion(product)"
                class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Eliminar Producto"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación Profesional Centrada con Select y buen espaciado abajo -->
    <div
      class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 my-4"
    >
      <!-- Selector de registros por página -->
      <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Mostrar:</span>
        <select
          v-model.number="porPagina"
          class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <span>por página</span>
      </div>

      <!-- Navegación por Números Centrada con Puntos Suspensivos -->
      <div class="flex items-center gap-1">
        <button
          @click="cambiarPagina(paginaActual - 1)"
          :disabled="paginaActual === 1 || totalPaginas === 0"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          &lt;
        </button>

        <template v-for="(page, index) in displayedPages" :key="index">
          <button
            v-if="page !== '...'"
            @click="cambiarPagina(Number(page))"
            :class="
              paginaActual === page
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-400 font-semibold border-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            "
            class="w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors cursor-pointer"
          >
            {{ page }}
          </button>

          <span
            v-else
            class="w-8 h-8 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-bold"
          >
            ...
          </span>
        </template>

        <button
          @click="cambiarPagina(paginaActual + 1)"
          :disabled="paginaActual === totalPaginas || totalPaginas === 0"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          &gt;
        </button>
      </div>

      <!-- Texto informativo opcional a la derecha (o equilibrador visual) -->
      <div class="text-xs text-slate-500 dark:text-slate-400">
        Pág. <span class="font-medium text-slate-700 dark:text-slate-200">{{ paginaActual }}</span> de <span class="font-medium text-slate-700 dark:text-slate-200">{{ totalPaginas }}</span>
      </div>
    </div>
  </div>

  <!-- Modales -->
  <EditCatalogItemModal :isOpen="isModalOpen" :id="selectedItem.id" @close="isModalOpen = false" />
  <CreateCatalogItemModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" />
</template>
