import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css' // O la ruta correcta de tu archivo css global

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

/* --- FontAwesome --- */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBars,
  faSearch,
  faSun,
  faMoon,
  faBell,
  faCheck,
  faLayerGroup,
  faPenToSquare,
  faTags,
  faSquareCheck,
  faUpload,
  faArrowRightFromBracket,
  faXmark,
  faBagShopping,
  faBoxesStacked,
  faChevronRight,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import { faBell as faRegularBell } from '@fortawesome/free-regular-svg-icons'

// Añadimos los iconos que usamos en el layout, sidebar y header
library.add(
  faBars,
  faSearch,
  faSun,
  faMoon,
  faBell,
  faCheck,
  faLayerGroup,
  faPenToSquare,
  faTags,
  faSquareCheck,
  faUpload,
  faArrowRightFromBracket,
  faXmark,
  faRegularBell,
  faBagShopping,
  faBoxesStacked,
  faChevronRight,
  faChevronDown
)

const app = createApp(App)

// Crea una instancia del cliente de Vue Query
const queryClient = new QueryClient()

// Instala el plugin en Vue
app.use(VueQueryPlugin, { queryClient })

// Registra el componente Devtools para inspeccionar peticiones
app.component('VueQueryDevtools', VueQueryDevtools)

app.use(Vue3Toastify, {
  autoClose: 4000,
  theme: 'colored',
  pauseOnHover: false,
  pauseOnFocusLoss: false,

  // ...
} as ToastContainerOptions)

app.use(createPinia())
app.use(router)

// Registramos el componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
