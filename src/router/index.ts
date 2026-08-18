import { useUserStore } from '@/bussiness/stores/user.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    {
      path: '/',
      redirect: { name: 'sign-in' },
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { requiresNotAuth: true },
      redirect: { name: 'sign-in' },
      children: [
        {
          path: 'sign-in',
          name: 'sign-in',
          component: () => import('@/views/SignInView.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/ForgotPasswordView.vue'),
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('@/views/ResetPasswordView.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/DashboardLayout.vue'),
      name: 'dashboard-layout',
      meta: { requiresAuth: true },
      // component:DashboardLayout,
      redirect: { name: 'menu' },
      children: [
        {
          path: 'menu',
          name: 'menu',
          component: () => import('@/views/MenuView.vue'),
        },
        {
          path: 'banner',
          name: 'banner',
          component: () => import('@/views/BannerView.vue'),
        },
        {
          path: 'how-order',
          name: 'how-order',
          component: () => import('@/views/HowToOrderView.vue'),
        },
        {
          path: 'catalog-section',
          name: 'catalog-section',
          component: () => import('@/views/CatalogSectionView.vue'),
        },
        {
          path: 'catalog-product',
          name: 'catalog-item',
          component: () => import('@/views/CatalogItemView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth && !(await isAuthenticated())) {
    localStorage.removeItem('TOKEN_LANDINGPAGE')
    return { name: 'sign-in', replace: true }
  } else if (to.meta.requiresNotAuth && (await isAuthenticated())) {
    return { name: 'dashboard-layout', replace: true }
  }

  return
})

async function isAuthenticated(): Promise<boolean> {
  try {
    const authStore = useUserStore()
    await authStore.checkAuth()
    return authStore.isAuthenticated
  } catch {
    return false
  }
}

export default router
