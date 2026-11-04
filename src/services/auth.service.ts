import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

import { firebaseAuth, googleProvider } from '@/lib/firebase'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'

export async function loginWithGoogle() {
  const authStore = useAuthStore()

  authStore.isLoading = true

  try {
    const credential = await signInWithPopup(firebaseAuth, googleProvider)

    const idToken = await credential.user.getIdToken()
    const session = await authApi.googleLogin(idToken)

    authStore.setSession(session.user, session.accessToken)

    return session.user
  } catch (error: unknown) {
    // Keep the original error available to the calling component.
    throw error
  } finally {
    authStore.isLoading = false
  }
}

export async function restoreSession() {
  const authStore = useAuthStore()

  try {
    const session = await authApi.refresh()
    authStore.setSession(session.user, session.accessToken)
    return true
  } catch {
    authStore.clearSession()
    return false
  } finally {
    authStore.initialized = true
  }
}

export async function logout() {
  const authStore = useAuthStore()
  const token = authStore.accessToken

  try {
    if (token) {
      await authApi.logout(token)
    }
  } finally {
    authStore.clearSession()
    await signOut(firebaseAuth)
  }
}
