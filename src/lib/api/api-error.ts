import axios from 'axios'

interface BackendErrorResponse {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
  message?: string
}

export class ApiError extends Error {
  readonly status: number | undefined
  readonly code: string
  readonly details: unknown

  constructor(options: { message: string; status?: number; code?: string; details?: unknown }) {
    super(options.message)

    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code ?? 'UNKNOWN_ERROR'
    this.details = options.details
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError<BackendErrorResponse>(error)) {
    return new ApiError({
      message: 'Une erreur inattendue est survenue.',
      code: 'UNKNOWN_ERROR',
    })
  }

  if (!error.response) {
    return new ApiError({
      message:
        error.code === 'ECONNABORTED'
          ? 'La requête a dépassé le délai autorisé.'
          : 'Impossible de joindre le serveur. Vérifie ta connexion.',
      code: error.code === 'ECONNABORTED' ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR',
    })
  }

  const response = error.response
  const body = response.data

  return new ApiError({
    status: response.status,
    code: body?.error?.code ?? `HTTP_${response.status}`,
    message: body?.error?.message ?? body?.message ?? 'Une erreur est survenue lors de la requête.',
    details: body?.error?.details,
  })
}
