import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Loader from '../components/common/Loader.jsx'
import { deleteAddress, getAddresses, saveAddress } from '../services/userService.js'
import { validateRequired } from '../utils/validators.js'

const blankAddress = { fullName: '', street: '', city: '', postalCode: '', country: '' }

function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(blankAddress)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadAddresses() {
    setError('')
    try {
      const result = await getAddresses()
      setAddresses(result.addresses ?? result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    getAddresses()
      .then((result) => { if (active) setAddresses(result.addresses ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (Object.values(form).some((value) => !validateRequired(value))) {
      setError('Complete every address field.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await saveAddress(form)
      setForm(blankAddress)
      await loadAddresses()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setError('')
    try {
      await deleteAddress(id)
      setAddresses((current) => current.filter((address) => (address._id ?? address.id) !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (loading) return <div className="page-shell page-content"><Loader label="Loading addresses" /></div>

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Your account</span><h1>Addresses</h1></header>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="account-layout">
        <section className="address-list">
          {addresses.length === 0
            ? <p className="empty-state">No saved addresses yet.</p>
            : addresses.map((address) => {
              const id = address._id ?? address.id
              return (
                <article className="address-card" key={id}>
                  <strong>{address.fullName}</strong>
                  <span>{address.street}</span>
                  <span>{address.city}, {address.postalCode}</span>
                  <span>{address.country}</span>
                  <button type="button" className="remove-item" onClick={() => handleDelete(id)}>Remove address</button>
                </article>
              )
            })}
        </section>
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Add an address</h2>
          <Input label="Full name" name="fullName" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <Input label="Street address" name="street" required value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} />
          <Input label="City" name="city" required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
          <Input label="Postal code" name="postalCode" required value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} />
          <Input label="Country" name="country" required value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save address'}</Button>
        </form>
      </div>
    </div>
  )
}

export default Addresses