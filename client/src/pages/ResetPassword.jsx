import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import { resetPassword } from '../services/authService.js'
import { validatePassword } from '../utils/validators.js'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!validatePassword(password)) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('The passwords do not match.')
    setLoading(true)
    try {
      await resetPassword(token, password)
      navigate('/login', { replace: true, state: { notice: 'Password updated. Please sign in.' } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell auth-page">
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Account help</span>
        <h1>Choose a new password</h1>
        <Input label="New password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        <Input label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Updating…' : 'Update password'}</Button>
        <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
      </form>
    </div>
  )
}

export default ResetPassword