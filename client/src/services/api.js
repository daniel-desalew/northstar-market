import axios from 'axios'
import { API_BASE_URL } from '../utils/constants.js'
import { useAuthStore } from '../store/authStore.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The server took too long to respond.'
        : error.response
          ? 'The request could not be completed.'
          : 'Could not connect to the store server. Check that the backend is running.')
    return Promise.reject(new Error(message, { cause: error }))
  },
)

export default api