import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from '@/types/auth.types'
import { authApi } from '@/lib/api/auth.api'
import { setAccessToken } from '@/lib/api/auth-token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(null)
  const initialized = ref(false)

  let initializationPromise: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null && accessToken.value !== null)

  function setSession(authenticatedUser: AuthUser, token: string) {
    user.value = authenticatedUser
    accessToken.value = token
    setAccessToken(token)
  }

  function clearSession() {
    user.value = null
    accessToken.value = null
    setAccessToken(null)
  }

  function initialize() {
    if (initialized.value) return Promise.resolve()
    if (initializationPromise) return initializationPromise

    initializationPromise = (async () => {
      try {
        const session = await authApi.refresh()
        setSession(session.user, session.accessToken)
      } catch {
        clearSession()
      } finally {
        initialized.value = true
      }
    })()

    return initializationPromise
  }

  return {
    user,
    accessToken,
    initialized,
    isAuthenticated,
    setSession,
    clearSession,
    initialize,
  }
})
