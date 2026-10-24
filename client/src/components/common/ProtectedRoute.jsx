import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'

function ProtectedRoute({ adminOnly = false, children }) {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children || <Outlet />
}

export default ProtectedRoute