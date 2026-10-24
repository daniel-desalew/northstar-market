import { useEffect, useState } from 'react'
import Loader from '../../components/common/Loader.jsx'
import { getUsers } from '../../services/userService.js'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getUsers()
      .then((result) => { if (active) setUsers(result.users ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Store management</span><h1>Customers</h1></header>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <Loader label="Loading customers" /> : (
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>
          {users.map((user) => <tr key={user._id ?? user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td></tr>)}
        </tbody></table>{users.length === 0 && <p className="empty-state">The API returned no customers.</p>}</div>
      )}
    </div>
  )
}

export default AdminUsers