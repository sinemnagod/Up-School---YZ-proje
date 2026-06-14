import axios from 'axios'

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; detail?: string; message?: string } | undefined
    if (data?.error) return data.error
    if (data?.detail) return data.detail
    if (data?.message) return data.message
    if (err.code === 'ECONNABORTED') return 'Request timed out. Please try again.'
    if (!err.response) return 'Unable to connect. Check your internet connection.'
    if (err.response.status === 401) return 'Please sign in to continue.'
    if (err.response.status === 403) return 'You do not have permission to do that.'
    if (err.response.status === 404) return 'The requested item was not found.'
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}
