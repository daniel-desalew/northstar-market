import ProtectedRoute from '../components/common/ProtectedRoute.jsx'

function AdminRoute() {
  return <ProtectedRoute adminOnly />
}

export default AdminRoute