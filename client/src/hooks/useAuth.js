import { useState } from 'react'
import * as authService from '../services/authService.js'
import { useAuthStore } from '../store/authStore.js'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function runAuthRequest(request) {
    setLoading(true)
    setError('')
    try {
      const result = await request()
      if (result.token && result.user) setSession(result)
      return result
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    login: (credentials) => runAuthRequest(() => authService.login(credentials)),
    register: (details) => runAuthRequest(() => authService.register(details)),
    logout: clearSession,
    clearError: () => setError(''),
  }
}