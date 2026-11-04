import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.view.vue'),
      meta: {
        guestOnly: true,
      },
    },

    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.view.vue'),
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/User.view.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/questions/:slug',
      name: 'question-detail',
      component: () => import('@/views/questions/QuestionDetail.view.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/404.view.vue'),
    },
  ],

  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  await auth.initialize()

  // Protected pages require an authenticated user.
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'auth',
      query: { redirect: to.fullPath },
    }
  }

  // Authenticated users should not revisit guest-only pages.
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'user' }
  }

  return true
})
export default router
