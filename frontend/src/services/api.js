import axios from 'axios'
import { getToken } from '../utils/auth.js'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

const api = axios.create({
  baseURL: apiBaseUrl || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

function configurationError(message, cause) {
  const error = new Error(message, cause ? { cause } : undefined)
  error.code = 'FASTOR_API_CONFIG'
  return error
}

api.interceptors.request.use((config) => {
  if (!apiBaseUrl) {
    throw configurationError(
      'Fastor API host is not configured. Set VITE_API_BASE_URL in frontend/.env. Without the host, requests would incorrectly go to localhost:5173.',
    )
  }

  let parsedBaseUrl
  try {
    parsedBaseUrl = new URL(apiBaseUrl)
  } catch (error) {
    throw configurationError('VITE_API_BASE_URL must be an absolute http(s) URL.', error)
  }
  if (!['http:', 'https:'].includes(parsedBaseUrl.protocol)) {
    throw configurationError('VITE_API_BASE_URL must be an absolute http(s) URL.')
  }

  config.baseURL = apiBaseUrl.replace(/\/+$/, '')
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'FASTOR_API_CONFIG') return Promise.reject(error)

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED'
        ? 'The request took too long. Please try again.'
        : error.response
          ? 'The request could not be completed. Please try again.'
          : 'Unable to reach the service. Check your connection and try again.')
    return Promise.reject(new Error(message, { cause: error }))
  },
)

export default api
