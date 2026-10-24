import { useAuth } from '../hooks/useAuth.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}