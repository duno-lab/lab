import { api } from './client'
import type { AuthMeResponse, OAuthLoginResponse } from '@/types/auth.types'

export const authApi = {
  async googleLogin(idToken: string) {
    const response = await api.post<OAuthLoginResponse>(
      '/auth/oauth',
      {
        provider: 'google',
        idToken,
      },
      {
        withCredentials: true,
      }
    )

    return response.data
  },

  async refresh() {
    const response = await api.post<OAuthLoginResponse>(
      '/auth/refresh',
      {},
      {
        withCredentials: true,
      }
    )

    return response.data
  },

  async me(accessToken: string) {
    const response = await api.get<AuthMeResponse>('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.data.user
  },

  async logout(accessToken: string) {
    await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    )
  },
}
