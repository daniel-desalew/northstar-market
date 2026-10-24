import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { validateEmail, validatePassword, validateRequired } from '../utils/validators.js'

function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!validateRequired(form.name)) return setError('Enter your name.')
    if (!validateEmail(form.email)) return setError('Enter a valid email address.')
    if (!validatePassword(form.password)) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirmPassword) return setError('The passwords do not match.')
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/profile', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to the store server. Check that the backend is running.')
    }
  }

  return (
    <div className="page-shell auth-page">
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Join Northstar</span>
        <h1>Create account</h1>
        <Input label="Full name" name="name" autoComplete="name" required value={form.name} onChange={update} />
        <Input label="Email address" name="email" type="email" autoComplete="email" required value={form.email} onChange={update} />
        <Input label="Password" name="password" type="password" autoComplete="new-password" required value={form.password} onChange={update} />
        <Input label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" required value={form.confirmPassword} onChange={update} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
        <p className="auth-switch">Already a customer? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  )
}

export default Register
