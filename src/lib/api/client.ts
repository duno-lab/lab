import axios from 'axios'
import { normalizeApiError } from './api-error'
import { getAccessToken } from './auth-token'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim()

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL est absente. Vérifie ton fichier .env.')
}

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error))
)
