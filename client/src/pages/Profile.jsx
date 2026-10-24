import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Loader from '../components/common/Loader.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getProfile, updateProfile } from '../services/userService.js'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    getProfile()
      .then((result) => {
        if (!active) return
        const profile = result.user ?? result
        setForm({ name: profile.name ?? '', email: profile.email ?? '' })
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      await updateProfile(form)
      setMessage('Profile updated.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  if (loading) return <div className="page-shell page-content"><Loader label="Loading profile" /></div>

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Your account</span><h1>Profile</h1></header>
      <div className="account-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Personal details</h2>
          <Input label="Name" name="name" autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input label="Email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </form>
        <aside className="account-links">
          <Link to="/addresses">Manage addresses</Link>
          <Link to="/orders">View your orders</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin dashboard</Link>}
          <button type="button" onClick={handleLogout}>Sign out</button>
        </aside>
      </div>
    </div>
  )
}

export default Profile