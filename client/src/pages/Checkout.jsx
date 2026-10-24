import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import CartSummary from '../components/cart/CartSummary.jsx'
import { useCart } from '../hooks/useCart.js'
import { createOrder } from '../services/orderService.js'
import { useAuthStore } from '../store/authStore.js'
import { validateRequired } from '../utils/validators.js'

const initialAddress = { fullName: '', street: '', city: '', postalCode: '', country: '' }

function Checkout() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [address, setAddress] = useState({ ...initialAddress, fullName: user?.name ?? '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const missing = Object.entries(address).some(([, value]) => !validateRequired(value))
    if (missing) {
      setError('Please complete every shipping address field.')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setLoading(true)
    try {
      const result = await createOrder({
        items: items.map(({ id, quantity }) => ({ product: id, quantity })),
        shippingAddress: address,
      })
      const order = result.order ?? result
      if (!order._id && !order.id) {
        throw new Error('The server did not return an order confirmation.')
      }
      clearCart()
      navigate('/order-success', { state: { orderId: order._id ?? order.id } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-shell page-content empty-cart">
        <h1>Your cart is empty</h1>
        <Link className="ui-button ui-button--primary" to="/products">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Almost there</span><h1>Checkout</h1></header>
      <div className="cart-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Shipping address</h2>
          <p className="form-note">Orders are submitted to the configured store API. No payment is taken by this demo client.</p>
          <Input label="Full name" name="fullName" autoComplete="name" required value={address.fullName} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} />
          <Input label="Street address" name="street" autoComplete="street-address" required value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} />
          <div className="form-row">
            <Input label="City" name="city" autoComplete="address-level2" required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
            <Input label="Postal code" name="postalCode" autoComplete="postal-code" required value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} />
          </div>
          <Input label="Country" name="country" autoComplete="country-name" required value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Submitting order…' : 'Place order'}</Button>
        </form>
        <CartSummary subtotal={subtotal} itemCount={itemCount} checkout={false} />
      </div>
    </div>
  )
}

export default Checkout